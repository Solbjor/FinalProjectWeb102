import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../lib/api.js'
import { timeAgo } from '../lib/time.js'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => { getPosts().then(setPosts) }, [])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts
      .filter((p) => p.title.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'upvotes'
          ? b.upvotes - a.upvotes
          : new Date(b.created_at) - new Date(a.created_at))
  }, [posts, search, sort])

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search posts by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort posts">
          <option value="newest">Newest</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No posts found.</p>
      ) : (
        <ul className="feed">
          {visible.map((p) => (
            <li key={p.id}>
              <Link to={`/post/${p.id}`} className="card post-row">
                <div>
                  <h2>{p.title}</h2>
                  <span className="muted">{timeAgo(p.created_at)}</span>
                </div>
                <span className="votes">▲ {p.upvotes}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
