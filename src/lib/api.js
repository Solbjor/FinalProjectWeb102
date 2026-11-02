// Data layer. Every function is async so swapping in Supabase later only means
// changing the bodies here (see the SUPABASE comments). Until then, data lives
// in localStorage so the app works with no backend.
// import { supabase } from './supabase'

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
const uid = () => crypto.randomUUID()

export async function getPosts() {
  // SUPABASE: const { data, error } = await supabase.from('posts').select('*'); if (error) throw error; return data
  return load().posts
}

export async function getPost(id) {
  // SUPABASE: supabase.from('posts').select('*').eq('id', id).single()
  return load().posts.find((p) => p.id === id) ?? null
}

export async function createPost({ title, content, image_url }) {
  // SUPABASE: supabase.from('posts').insert({ title, content, image_url }).select().single()
  const data = load()
  const post = { id: uid(), created_at: new Date().toISOString(), title, content, image_url, upvotes: 0 }
  data.posts.push(post)
  save(data)
  return post
}

export async function updatePost(id, fields) {
  // SUPABASE: supabase.from('posts').update(fields).eq('id', id).select().single()
  const data = load()
  data.posts = data.posts.map((p) => (p.id === id ? { ...p, ...fields } : p))
  save(data)
  return data.posts.find((p) => p.id === id)
}

export async function deletePost(id) {
  // SUPABASE: supabase.from('posts').delete().eq('id', id)  (comments cascade)
  const data = load()
  data.posts = data.posts.filter((p) => p.id !== id)
  data.comments = data.comments.filter((c) => c.post_id !== id)
  save(data)
}

export async function upvotePost(id) {
  // SUPABASE: supabase.rpc('increment_upvotes', { post_id: id })
  const data = load()
  const post = data.posts.find((p) => p.id === id)
  post.upvotes += 1
  save(data)
  return post.upvotes
}

export async function getComments(postId) {
  // SUPABASE: supabase.from('comments').select('*').eq('post_id', postId).order('created_at')
  return load().comments.filter((c) => c.post_id === postId)
}

export async function addComment(postId, content) {
  // SUPABASE: supabase.from('comments').insert({ post_id: postId, content }).select().single()
  const data = load()
  const comment = { id: uid(), post_id: postId, created_at: new Date().toISOString(), content }
  data.comments.push(comment)
  save(data)
  return comment
}
