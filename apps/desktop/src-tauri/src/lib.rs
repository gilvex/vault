use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
    process::{Child, Command},
    sync::Mutex,
    time::Instant,
};
use tauri::{Manager, State};
use tauri_plugin_dialog::DialogExt;

#[derive(Clone, Serialize, Deserialize)]
struct SavedGame {
    id: String,
    name: String,
    path: PathBuf,
    seconds: u64,
}

#[derive(Serialize)]
struct LocalGame {
    id: String,
    name: String,
    path: String,
    running: bool,
    seconds: u64,
}

struct Session {
    child: Child,
    started: Instant,
}

struct Library {
    games: Vec<SavedGame>,
    sessions: HashMap<String, Session>,
    path: PathBuf,
}

impl Library {
    fn persist(&self) -> Result<(), String> {
        let json = serde_json::to_vec_pretty(&self.games).map_err(|e| e.to_string())?;
        // Keep a previous valid copy so a interrupted write can be recovered.
        if self.path.exists() {
            fs::copy(&self.path, self.path.with_extension("backup.json"))
                .map_err(|e| e.to_string())?;
        }
        fs::write(&self.path, json).map_err(|e| format!("Could not save the local library: {e}"))
    }

    fn reap_finished(&mut self) -> Result<(), String> {
        let mut finished = Vec::new();
        for (id, session) in &mut self.sessions {
            match session.child.try_wait() {
                Ok(Some(_)) => finished.push((id.clone(), session.started.elapsed().as_secs())),
                Ok(None) => (),
                Err(e) => return Err(format!("Could not read game process status: {e}")),
            }
        }
        if !finished.is_empty() {
            for (id, seconds) in finished {
                self.sessions.remove(&id);
                if let Some(game) = self.games.iter_mut().find(|game| game.id == id) {
                    game.seconds += seconds;
                }
            }
            self.persist()?;
        }
        Ok(())
    }

    fn view(&self, game: &SavedGame) -> LocalGame {
        let session = self.sessions.get(&game.id);
        LocalGame {
            id: game.id.clone(),
            name: game.name.clone(),
            path: game.path.display().to_string(),
            running: session.is_some(),
            seconds: game.seconds + session.map_or(0, |s| s.started.elapsed().as_secs()),
        }
    }
}

fn executable_path(path: &Path) -> Result<PathBuf, String> {
    let path = path
        .canonicalize()
        .map_err(|e| format!("This executable is no longer available: {e}"))?;
    if !path.is_file() {
        return Err("Choose a game executable, not a folder.".into());
    }
    #[cfg(target_os = "windows")]
    if path
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.to_ascii_lowercase())
        != Some("exe".into())
    {
        return Err("Choose a Windows .exe file.".into());
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        if fs::metadata(&path)
            .map_err(|e| e.to_string())?
            .permissions()
            .mode()
            & 0o111
            == 0
        {
            return Err("The selected file does not have executable permission.".into());
        }
    }
    Ok(path)
}

#[tauri::command]
fn list_local_games(library: State<'_, Mutex<Library>>) -> Result<Vec<LocalGame>, String> {
    let mut library = library.lock().map_err(|e| e.to_string())?;
    library.reap_finished()?;
    Ok(library
        .games
        .iter()
        .map(|game| library.view(game))
        .collect())
}

#[tauri::command]
async fn register_local_game(
    app: tauri::AppHandle,
    library: State<'_, Mutex<Library>>,
) -> Result<Option<LocalGame>, String> {
    let picker = app.dialog().file().set_title("Add a local game executable");
    #[cfg(target_os = "windows")]
    let picker = picker.add_filter("Game executable", &["exe"]);
    let Some(selected) = picker.blocking_pick_file() else {
        return Ok(None);
    };
    let selected_path = selected.into_path().map_err(|e| e.to_string())?;
    let path = executable_path(&selected_path)?;
    let mut library = library.lock().map_err(|e| e.to_string())?;
    if let Some(game) = library.games.iter().find(|game| game.path == path) {
        return Ok(Some(library.view(game)));
    }
    let name = path
        .file_stem()
        .and_then(|name| name.to_str())
        .unwrap_or("Local game")
        .to_owned();
    let game = SavedGame {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        path,
        seconds: 0,
    };
    let view = library.view(&game);
    library.games.push(game);
    if let Err(error) = library.persist() {
        library.games.pop();
        return Err(error);
    }
    Ok(Some(view))
}

#[tauri::command]
fn launch_local_game(id: String, library: State<'_, Mutex<Library>>) -> Result<(), String> {
    let mut library = library.lock().map_err(|e| e.to_string())?;
    library.reap_finished()?;
    if library.sessions.contains_key(&id) {
        return Err("This game is already running.".into());
    }
    // The frontend can only supply a registered UUID. It cannot supply a shell command or path.
    let game = library
        .games
        .iter()
        .find(|game| game.id == id)
        .ok_or("This game is not registered.")?;
    let path = executable_path(&game.path)?;
    let child = Command::new(&path)
        .current_dir(path.parent().ok_or("Invalid executable location")?)
        .spawn()
        .map_err(|e| format!("Could not launch {}: {e}", game.name))?;
    library.sessions.insert(
        id,
        Session {
            child,
            started: Instant::now(),
        },
    );
    Ok(())
}

#[tauri::command]
fn remove_local_game(id: String, library: State<'_, Mutex<Library>>) -> Result<(), String> {
    let mut library = library.lock().map_err(|e| e.to_string())?;
    library.reap_finished()?;
    if library.sessions.contains_key(&id) {
        return Err("Close the game before removing it from Vault.".into());
    }
    let previous = library.games.clone();
    library.games.retain(|game| game.id != id);
    if let Err(error) = library.persist() {
        library.games = previous;
        return Err(error);
    }
    Ok(())
}

#[tauri::command]
async fn export_backup(app: tauri::AppHandle, contents: String) -> Result<Option<String>, String> {
    if contents.len() > 2_000_000 {
        return Err("Backup is too large (maximum 2 MB).".into());
    }
    let json: serde_json::Value =
        serde_json::from_str(&contents).map_err(|_| "Backup must be valid JSON")?;
    if json.get("version").and_then(|v| v.as_u64()) != Some(1) {
        return Err("Unsupported backup version".into());
    }
    let Some(selected) = app
        .dialog()
        .file()
        .set_title("Save Vault demo backup")
        .set_file_name("vault-demo-backup.json")
        .add_filter("JSON backup", &["json"])
        .blocking_save_file()
    else {
        return Ok(None);
    };
    let path = selected.into_path().map_err(|e| e.to_string())?;
    fs::write(&path, contents).map_err(|e| format!("Could not save backup: {e}"))?;
    Ok(Some(path.display().to_string()))
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SystemInfo {
    os: String,
    arch: String,
    version: String,
    data_dir: String,
}

#[tauri::command]
fn system_info(app: tauri::AppHandle) -> Result<SystemInfo, String> {
    Ok(SystemInfo {
        os: std::env::consts::OS.into(),
        arch: std::env::consts::ARCH.into(),
        version: app.package_info().version.to_string(),
        data_dir: app
            .path()
            .app_data_dir()
            .map_err(|e| e.to_string())?
            .display()
            .to_string(),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let directory = app.path().app_data_dir()?;
            fs::create_dir_all(&directory)?;
            let path = directory.join("local-library.json");
            let games: Vec<SavedGame> = if path.exists() {
                let contents = fs::read(&path)?;
                match serde_json::from_slice(&contents) {
                    Ok(games) => games,
                    Err(_) => {
                        // Preserve a damaged file; never silently overwrite an existing library.
                        fs::copy(&path, directory.join("local-library.corrupt.json"))?;
                        let backup = fs::read(path.with_extension("backup.json"))?;
                        serde_json::from_slice(&backup)?
                    }
                }
            } else {
                Vec::new()
            };
            app.manage(Mutex::new(Library {
                games,
                sessions: HashMap::new(),
                path,
            }));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_local_games,
            register_local_game,
            launch_local_game,
            remove_local_game,
            export_backup,
            system_info
        ])
        .build(tauri::generate_context!())
        .expect("Unable to start Vault");
    app.run(|handle, event| {
        if let tauri::RunEvent::Exit = event {
            let state = handle.state::<Mutex<Library>>();
            if let Ok(mut library) = state.lock() {
                let sessions = std::mem::take(&mut library.sessions);
                for (id, session) in sessions {
                    if let Some(game) = library.games.iter_mut().find(|game| game.id == id) {
                        game.seconds += session.started.elapsed().as_secs();
                    }
                }
                if let Err(error) = library.persist() {
                    eprintln!("{error}");
                }
            };
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn missing_executable_is_rejected() {
        assert!(executable_path(Path::new("/definitely-not-a-vault-game-12345.exe")).is_err());
    }

    #[test]
    fn directory_cannot_be_launched() {
        assert!(executable_path(&std::env::temp_dir()).is_err());
    }

    #[test]
    fn library_roundtrip_keeps_previous_backup() {
        let dir = std::env::temp_dir().join(format!("vault-test-{}", uuid::Uuid::new_v4()));
        fs::create_dir_all(&dir).unwrap();
        let mut library = Library {
            games: vec![],
            sessions: HashMap::new(),
            path: dir.join("library.json"),
        };
        library.persist().unwrap();
        library.games.push(SavedGame {
            id: "test".into(),
            name: "Test game".into(),
            path: PathBuf::from("test.exe"),
            seconds: 42,
        });
        library.persist().unwrap();
        let restored: Vec<SavedGame> =
            serde_json::from_slice(&fs::read(&library.path).unwrap()).unwrap();
        assert_eq!(restored[0].seconds, 42);
        let backup: Vec<SavedGame> =
            serde_json::from_slice(&fs::read(library.path.with_extension("backup.json")).unwrap())
                .unwrap();
        assert!(backup.is_empty());
        fs::remove_dir_all(dir).unwrap();
    }
}
