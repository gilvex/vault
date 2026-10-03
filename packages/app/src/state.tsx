import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react'
import { parseState, type DemoState } from '@vault/core'
import { toast } from 'sonner'

const KEY = 'vault.demo.v1'
const Context = createContext<{
  state: DemoState
  setState: Dispatch<SetStateAction<DemoState>>
} | null>(null)
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => {
    try {
      return parseState(localStorage.getItem(KEY))
    } catch {
      return parseState(null)
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      toast.error('Browser storage is unavailable. Changes will last for this session only.', {
        id: 'storage',
      })
    }
    document.documentElement.dataset.reducedMotion = String(state.settings.reducedMotion)
  }, [state])
  const value = useMemo(() => ({ state, setState }), [state])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useDemo() {
  const value = useContext(Context)
  if (!value) throw new Error('useDemo needs DemoProvider')
  return value
}
export function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/profile/activity')
  useEffect(() => {
    const update = () => setRoute(location.hash.slice(1) || '/profile/activity')
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return route
}

const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribeMotion = (listener: () => void) => {
  const media = motionQuery()
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
export function useReducedMotion() {
  const { state } = useDemo()
  const systemPreference = useSyncExternalStore(
    subscribeMotion,
    () => motionQuery().matches,
    () => false,
  )
  return state.settings.reducedMotion || systemPreference
}
