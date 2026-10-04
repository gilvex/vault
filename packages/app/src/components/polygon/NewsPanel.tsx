import { useState } from 'react'
import { Bookmark, Eye, Heart, Megaphone, Share2 } from 'lucide-react'
import { newsItems, toggleItem } from '@vault/core'
import { cn } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { MockLabel, Panel, Picture, Tags } from './shared'
import { polygonArt as art } from '../../assets'

export function NewsPanel({
  compact = false,
  expand = '#/home/news',
  game = false,
}: {
  compact?: boolean
  expand?: string
  game?: boolean
}) {
  const { state, setState } = useDemo()
  const [selectedId, setSelectedId] = useState(game ? 'sanctuary' : 'frontier')
  const selected = newsItems.find((item) => item.id === selectedId) || newsItems[0]
  const liked = state.liked.includes(`news-${selected.id}`)
  const saved = state.saved.includes(`news-${selected.id}`)
  async function share() {
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}${expand}`)
      toast.success('Community news link copied')
    } catch {
      toast.error('Clipboard unavailable. Copy the URL from your browser.')
    }
  }
  return (
    <Panel
      title="News"
      icon={Megaphone}
      className={cn('pg-news', compact && 'pg-compact')}
      expand={expand}
      action={<MockLabel />}
    >
      <div className="pg-news-body">
        <div className="pg-news-list" aria-label="News stories">
          {newsItems.map((item) => (
            <button
              key={item.id}
              className={cn('pg-news-item', selected.id === item.id && 'active')}
              aria-pressed={selected.id === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="pg-list-meta">
                <time>{item.date}</time>
                <span>
                  11.8K <Eye size={13} />
                  <Share2 size={14} />
                </span>
              </span>
              <span className="pg-list-story">
                <Picture name={item.image} width={64} height={64} />
                <span>
                  <strong>{item.title}</strong>
                  <Tags values={item.tags} />
                </span>
              </span>
            </button>
          ))}
        </div>
        <article className="pg-news-article">
          <div
            className="pg-article-scroll"
            style={{
              backgroundImage: `linear-gradient(180deg, #151519b0, #151519 55%), url(${art(selected.banner)})`,
            }}
          >
            <div className="pg-article-author">
              <Picture name={game ? 'diablo-avatar' : 'vault-avatar'} width={48} height={48} />
              <strong>{selected.author}</strong>
              <Picture
                name={selected.image}
                width={80}
                height={80}
                className="pg-article-thumbnail"
              />
            </div>
            <Tags values={selected.tags} />
            <h3>{selected.title} — prepare for the next chapter</h3>
            <p>{selected.body}</p>
            <Picture
              name={selected.banner}
              alt={selected.title}
              width={672}
              height={256}
              className="pg-news-image"
            />
            <p className="pg-article-extra">
              Discover the latest updates, share your thoughts, and find your next adventure with
              the community. This article is part of the Polygon demo.
            </p>
          </div>
          <footer className="pg-article-footer">
            <span>
              11.8K <Eye size={14} />
            </span>
            <button
              aria-label={saved ? 'Unsave news story' : 'Save news story'}
              aria-pressed={saved}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  saved: toggleItem(prev.saved, `news-${selected.id}`),
                }))
              }
            >
              <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button
              aria-label="Like news story"
              aria-pressed={liked}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  liked: toggleItem(prev.liked, `news-${selected.id}`),
                }))
              }
            >
              <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={share} aria-label="Share news">
              <Share2 size={17} />
            </button>
          </footer>
        </article>
      </div>
    </Panel>
  )
}
