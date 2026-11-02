import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addComment, deletePost, getComments, getPost, upvotePost } from '../lib/api.js'
import { timeAgo } from '../lib/time.js'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(undefined) // undefined = loading, null = missing
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    getPost(id).then(setPost)
    getComments(id).then(setComments)
  }, [id])

  if (post === undefined) return null
  if (post === null) return <p>Post not found. <Link to="/">Back home</Link></p>

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
    <article>
      <Link to="/" className="muted">← Back</Link>
      <div className="card">
        <span className="muted">{timeAgo(post.created_at)}</span>
        <h1>{post.title}</h1>
        {post.image_url && <img className="post-img" src={post.image_url} alt="" />}
        {post.content && <p className="body">{post.content}</p>}
        <div className="actions">
          <button onClick={upvote}>▲ Upvote · {post.upvotes}</button>
          <Link to={`/post/${id}/edit`} className="btn secondary">Edit</Link>
          <button className="danger" onClick={remove}>Delete</button>
        </div>
      </div>

      <h2>Comments ({comments.length})</h2>
      <form className="comment-form" onSubmit={submitComment}>
        <input placeholder="Leave a comment…" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Comment</button>
      </form>
      <ul className="comments">
        {comments.map((c) => (
          <li key={c.id} className="card">
            <p>{c.content}</p>
            <span className="muted">{timeAgo(c.created_at)}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
