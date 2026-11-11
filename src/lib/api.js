// Data layer. Uses Supabase when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are
// set in .env; otherwise falls back to localStorage so the app still runs.
import { supabase } from './supabase'

export const usingSupabase = Boolean(supabase)

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

// ---------- localStorage fallback ----------
const KEY = 'skyhub-data'

const seed = () => {
  const now = Date.now()
  return {
    posts: [
      { id: 'p1', created_at: new Date(now - 86400000 * 2).toISOString(), title: 'First time flying a Cessna 172 — any tips?', content: 'Starting my private pilot training next week. What do you wish you knew on day one?', image_url: '', upvotes: 12 },
      { id: 'p2', created_at: new Date(now - 3600000 * 5).toISOString(), title: 'Why do jets leave contrails?', content: 'Water vapor from the exhaust freezes at altitude, forming ice crystals.', image_url: '', upvotes: 7 },
    ],
    comments: [
      { id: 'c1', post_id: 'p1', created_at: new Date(now - 3600000).toISOString(), content: 'Learn your checklists cold. Enjoy it!' },
    ],
  }
}

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* fall through to seed */ }
  const data = seed()
  save(data)
  return data
}
const save = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage unavailable */ }
}

// ---------- public API ----------
export async function getPosts() {
  if (supabase) return unwrap(await supabase.from('posts').select('id, created_at, title, upvotes'))
  return load().posts
}

export async function getPost(id) {
  if (supabase) return unwrap(await supabase.from('posts').select('*').eq('id', id).maybeSingle())
  return load().posts.find((p) => p.id === id) ?? null
}

export async function createPost({ title, content, image_url }) {
  if (supabase) return unwrap(await supabase.from('posts').insert({ title, content, image_url }).select().single())
  const data = load()
  const post = { id: crypto.randomUUID(), created_at: new Date().toISOString(), title, content, image_url, upvotes: 0 }
  data.posts.push(post)
  save(data)
  return post
}

export async function updatePost(id, { title, content, image_url }) {
  if (supabase) return unwrap(await supabase.from('posts').update({ title, content, image_url }).eq('id', id).select().single())
  const data = load()
  data.posts = data.posts.map((p) => (p.id === id ? { ...p, title, content, image_url } : p))
  save(data)
  return data.posts.find((p) => p.id === id)
}

export async function deletePost(id) {
  if (supabase) return unwrap(await supabase.from('posts').delete().eq('id', id)) // comments cascade
  const data = load()
  data.posts = data.posts.filter((p) => p.id !== id)
  data.comments = data.comments.filter((c) => c.post_id !== id)
  save(data)
}

export async function upvotePost(id) {
  if (supabase) return unwrap(await supabase.rpc('increment_upvotes', { post_id: id }))
  const data = load()
  const post = data.posts.find((p) => p.id === id)
  post.upvotes += 1
  save(data)
  return post.upvotes
}

export async function getComments(postId) {
  if (supabase) return unwrap(await supabase.from('comments').select('*').eq('post_id', postId).order('created_at'))
  return load().comments.filter((c) => c.post_id === postId)
}

export async function addComment(postId, content) {
  if (supabase) return unwrap(await supabase.from('comments').insert({ post_id: postId, content }).select().single())
  const data = load()
  const comment = { id: crypto.randomUUID(), post_id: postId, created_at: new Date().toISOString(), content }
  data.comments.push(comment)
  save(data)
  return comment
}
