import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost } from '../lib/api.js'

export default function PostForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', image_url: '' })

  useEffect(() => {
    if (!editing) return
    getPost(id).then((p) => {
      if (p) setForm({ title: p.title, content: p.content ?? '', image_url: p.image_url ?? '' })
    })
  }, [id, editing])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const post = editing ? await updatePost(id, form) : await createPost(form)
    navigate(`/post/${post.id}`)
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h1>{editing ? 'Edit Post' : 'New Post'}</h1>
      <label>
        Title *
        <input value={form.title} onChange={set('title')} required />
      </label>
      <label>
        Content
        <textarea rows="6" value={form.content} onChange={set('content')} />
      </label>
      <label>
        Image URL
        <input type="url" placeholder="https://…" value={form.image_url} onChange={set('image_url')} />
      </label>
      <button type="submit">{editing ? 'Save Changes' : 'Post'}</button>
    </form>
  )
}
