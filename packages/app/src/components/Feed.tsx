import { useState } from 'react'
import {
  Bookmark,
  Check,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Button, Badge, Modal, cn } from '@vault/ui'
import { toggleItem, type Post } from '@vault/core'
import { toast } from 'sonner'
import { useDemo } from '../state'
import { assetUrl } from '../assets'
import { Avatar, Empty } from './common'

function PostCard({ post }: { post: Post }) {
  const { state, setState } = useDemo()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const self = post.author === 'guiltyplayer' || post.author === state.profile.name
  const liked = state.liked.includes(post.id)
  const saved = state.saved.includes(post.id)
  function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              comments: [
                ...item.comments,
                { id: crypto.randomUUID(), author: prev.profile.name, text: comment.trim() },
              ],
            }
          : item,
      ),
    }))
    setComment('')
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}${location.pathname}#/profile/activity?post=${post.id}`,
      )
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Clipboard unavailable. Copy the address from your browser.')
    }
  }
  return (
    <article className="post-card" id={`post-${post.id}`}>
      <header className="post-header">
        <Avatar name={post.author} self={self} status={self ? state.profile.status : 'playing'} />
        <div>
          <strong>{self ? state.profile.name : post.author}</strong>
          <span>
            {post.time} <span className="middle-dot">·</span>{' '}
            <span className="post-game">{post.tag}</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={saved ? 'Unsave post' : 'Save post'}
          aria-pressed={saved}
          onClick={() => setState((prev) => ({ ...prev, saved: toggleItem(prev.saved, post.id) }))}
        >
          <Bookmark className={saved ? 'fill-purple-400 text-purple-400' : ''} />
        </Button>
      </header>
      {post.image && (
        <div className="post-image">
          <img
            src={assetUrl(post.image)}
            alt="An unexpected encounter during a containment breach in SCP: Secret Laboratory"
          />
          <span className="image-label">
            <GameLabel /> GAME CAPTURE
          </span>
        </div>
      )}
      <div className="post-copy">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
      <footer className="post-footer">
        <button
          aria-label={`Like post: ${post.title}`}
          aria-pressed={liked}
          className={cn('reaction', liked && 'liked')}
          onClick={() => setState((prev) => ({ ...prev, liked: toggleItem(prev.liked, post.id) }))}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
          {post.likes + Number(liked)}
        </button>
        <button
          className={cn('reaction', commentsOpen && 'text-white')}
          aria-expanded={commentsOpen}
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          <MessageCircle size={17} />
          {post.comments.length}
          <span className="reaction-label">Comments</span>
        </button>
        <button className="reaction share-reaction" onClick={share}>
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </footer>
      {commentsOpen && (
        <div className="comments">
          {post.comments.length === 0 && (
            <p className="text-sm text-muted-foreground">Start the conversation.</p>
          )}
          {post.comments.map((item) => (
            <div className="comment" key={item.id}>
              <Avatar name={item.author} self={item.author === state.profile.name} />
              <div>
                <strong>{item.author}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
          <form className="comment-form" onSubmit={addComment}>
            <input
              aria-label="Write a comment"
              placeholder="Write a comment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            />
            <Button type="submit" size="icon" disabled={!comment.trim()} aria-label="Send comment">
              <Send />
            </Button>
          </form>
        </div>
      )}
    </article>
  )
}
function GameLabel() {
  return <span className="size-1.5 rounded-full bg-green-400" />
}

export function Feed({ home = false }: { home?: boolean }) {
  const { state, setState } = useDemo()
  const [createOpen, setCreateOpen] = useState(false)
  const [filter, setFilter] = useState('All activity')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('General')
  const [attach, setAttach] = useState(false)
  const savedPosts = new Set(state.saved)
  const posts = state.posts.filter((post) =>
    filter === 'Saved posts'
      ? savedPosts.has(post.id)
      : filter === 'My posts'
        ? post.author === state.profile.name || post.author === 'guiltyplayer'
        : true,
  )
  function createPost(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setState((prev) => ({
      ...prev,
      posts: [
        {
          id: crypto.randomUUID(),
          author: prev.profile.name,
          title: title.trim(),
          body: body.trim(),
          tag,
          time: 'Just now',
          likes: 0,
          comments: [],
          ...(attach ? { image: '/media/scp-moment.webp' } : {}),
        },
        ...prev.posts,
      ],
    }))
    setCreateOpen(false)
    setTitle('')
    setBody('')
    setAttach(false)
    setFilter('All activity')
    toast.success('Your moment is in the Vault')
  }
  return (
    <>
      <div className="feed-toolbar">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          <select
            aria-label="Filter activity"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All activity</option>
            <option>My posts</option>
            <option>Saved posts</option>
          </select>
          <span className="feed-count">{posts.length} moments</span>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus />
          Create post
        </Button>
      </div>
      <div className="feed-layout">
        <div className="feed-posts">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {!posts.length && (
            <Empty icon={<Bookmark size={28} />} title="A little quiet here">
              Save a post to keep your favorite moments close.
            </Empty>
          )}
          {filter === 'All activity' && (
            <div className="activity-line">
              <div className="activity-line-icon">
                <Check size={16} />
              </div>
              <p>
                <strong>{state.profile.name}</strong> added <a href="#/games/elden">Elden Ring</a>{' '}
                to their library
              </p>
              <span>Yesterday</span>
            </div>
          )}
          <div className="feed-end">
            <Sparkles size={15} />
            You’re all caught up. Go make a new memory.
          </div>
        </div>
        <aside className="feed-aside">
          <div className="panel">
            <div className="panel-heading">
              <h3>{home ? 'This week in Vault' : 'Your week in play'}</h3>
              <span className="tiny-dot" />
            </div>
            <div className="week-stat">
              <strong>
                24.8<span>hrs</span>
              </strong>
              <Badge className="text-green-400 border-green-400/20 bg-green-400/5">↑ 12%</Badge>
            </div>
            <div
              className="week-bars"
              aria-label="Playtime: Monday 2, Tuesday 4, Wednesday 3, Thursday 6, Friday 4, Saturday 5, Sunday 1 hours"
            >
              {[30, 55, 42, 86, 62, 73, 18].map((height, i) => (
                <div key={['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i]}>
                  <span style={{ height: `${height}%` }} />
                  <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small>
                </div>
              ))}
            </div>
            <p className="panel-caption">Good times, well spent.</p>
          </div>
          <div className="panel upcoming-panel">
            <Badge className="text-purple-300 border-purple-500/20">COMMUNITY NIGHT</Badge>
            <h3>Containment breach</h3>
            <p>Some things are better faced together.</p>
            <div className="event-time">
              <span>09</span>
              <div>
                OCTOBER<small>20:00 UTC · Friday</small>
              </div>
            </div>
            <Button asChild variant="secondary" size="sm">
              <a href="#/profile/events">View event →</a>
            </Button>
          </div>
          <div className="aside-footer">
            <span>VAULT © 2026</span>
            <span>Made for the way you play.</span>
            <span>Mock data · Saved on this device</span>
          </div>
        </aside>
      </div>
      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Share a moment"
        description="A great play, a new discovery, or just something worth remembering."
      >
        <form className="form-stack" onSubmit={createPost}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What happened in your world?"
              maxLength={140}
              required
            />
          </label>
          <label>
            Your story
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell your people about it…"
              maxLength={3000}
              rows={4}
            />
          </label>
          <label>
            Game
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option>General</option>
              <option>SCP: Secret Laboratory</option>
              <option>Cyberpunk 2077</option>
              <option>Elden Ring</option>
            </select>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} />
            Attach demo game capture
          </label>
          <div className="modal-footer">
            <span>Visible in this demo workspace</span>
            <Button type="submit" disabled={!title.trim()}>
              <Send />
              Publish post
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
