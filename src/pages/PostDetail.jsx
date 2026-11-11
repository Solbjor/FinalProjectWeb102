import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addComment, deletePost, getComments, getPost, upvotePost } from '../lib/api.js'
import { formatDate, timeAgo } from '../lib/time.js'
import Spinner from '../components/Spinner.jsx'
import PageHero from '../components/PageHero.jsx'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(undefined) // undefined = loading, null = missing
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    getPost(id).then(setPost).catch(() => setPost(null))
    getComments(id).then(setComments).catch(() => setComments([]))
  }, [id])

  if (post === undefined) return <Spinner label="Loading post…" />
  if (post === null) {
    return (
      <>
        <PageHero title="Post not found" subtitle="It may have been deleted." />
        <div className="wrap section center"><Link to="/" className="btn">Back to the feed</Link></div>
      </>
    )
  }

  async function upvote() {
    const upvotes = await upvotePost(id)
    setPost({ ...post, upvotes })
  }

  async function remove() {
    if (!window.confirm('Delete this post?')) return
    await deletePost(id)
    navigate('/')
  }

  async function submitComment(e) {
    e.preventDefault()
    if (!text.trim()) return
    const c = await addComment(id, text.trim())
    setComments([...comments, c])
    setText('')
  }

  return (
    <>
      <PageHero title={post.title} subtitle={`Posted ${formatDate(post.created_at)} · ${timeAgo(post.created_at)}`} />

      <article className="wrap narrow section">
        <Link to="/" className="back">← Back to the feed</Link>

        {post.image_url && <img className="post-img" src={post.image_url} alt="" />}
        {post.content && <p className="post-body">{post.content}</p>}

        <div className="actions">
          <button onClick={upvote}>▲ Upvote · {post.upvotes}</button>
          <Link to={`/post/${id}/edit`} className="btn btn-outline">Edit</Link>
          <button className="btn-danger" onClick={remove}>Delete</button>
        </div>

        <h2 className="comments-title">Comments ({comments.length})</h2>
        <form className="panel comment-form" onSubmit={submitComment}>
          <label className="field-label" htmlFor="comment">Join the discussion</label>
          <textarea
            id="comment"
            rows="3"
            placeholder="Leave a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Post comment</button>
        </form>

        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <p>{c.content}</p>
              <span className="muted">{timeAgo(c.created_at)}</span>
            </li>
          ))}
        </ul>
      </article>
    </>
  )
}
