import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost } from '../lib/api.js'
import Spinner from '../components/Spinner.jsx'
import PageHero from '../components/PageHero.jsx'

export default function PostForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', image_url: '' })
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!editing) return
    getPost(id)
      .then((p) => {
        if (p) setForm({ title: p.title, content: p.content ?? '', image_url: p.image_url ?? '' })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, editing])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    setError(null)
    try {
      const post = editing ? await updatePost(id, form) : await createPost(form)
      navigate(`/post/${post.id}`)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <Spinner label="Loading post…" />

  return (
    <>
      <PageHero
        title={editing ? 'Edit Post' : 'New Post'}
        subtitle={editing ? 'Update your post' : 'Share something with fellow aviators'}
      />

      <div className="wrap section">
        <form className="panel form-panel" onSubmit={submit}>
          <h2>{editing ? 'Make your changes' : "What's on your radar?"}</h2>
          <label className="field">
            <span className="field-label">Title <span className="req">*</span></span>
            <input placeholder="e.g. Tips for my first crosswind landing" value={form.title} onChange={set('title')} required />
          </label>
          <label className="field">
            <span className="field-label">Content</span>
            <textarea rows="6" placeholder="Add details (optional)" value={form.content} onChange={set('content')} />
          </label>
          <label className="field">
            <span className="field-label">Image URL</span>
            <input type="url" placeholder="https://… (optional)" value={form.image_url} onChange={set('image_url')} />
          </label>
          {error && <p className="error" style={{ marginBottom: 14 }}>Couldn't save: {error}</p>}
          <button type="submit" className="btn-block" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish post'}
          </button>
        </form>
      </div>
    </>
  )
}
