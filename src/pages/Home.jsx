import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../lib/api.js'
import { formatDate, timeAgo } from '../lib/time.js'
import Spinner from '../components/Spinner.jsx'
import PageHero from '../components/PageHero.jsx'

const SORTS = [
  ['newest', 'Newest'],
  ['upvotes', 'Most upvoted'],
]

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

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
      <PageHero title="The Hangar" subtitle="Stories, questions & tips from the flight line" />

      <div className="wrap section">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search posts by title…"
            aria-label="Search posts by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="segmented" role="group" aria-label="Sort posts">
            {SORTS.map(([value, label]) => (
              <button key={value} type="button" aria-pressed={sort === value} onClick={() => setSort(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading posts…" />
        ) : error ? (
          <p className="error">Couldn't load posts: {error}</p>
        ) : visible.length === 0 ? (
          <div className="empty">
            <p className="text">{search ? 'No posts match that search.' : 'No posts yet — be the first to share.'}</p>
            {!search && <Link to="/new" className="btn" style={{ marginTop: 16 }}>Write a post</Link>}
          </div>
        ) : (
          <ul className="grid">
            {visible.map((p) => (
              <li key={p.id}>
                <Link to={`/post/${p.id}`} className="post-card">
                  <span className="post-date" title={timeAgo(p.created_at)}>{formatDate(p.created_at)}</span>
                  <h2>{p.title}</h2>
                  <div className="post-card-foot">
                    <span className="btn btn-sm">Read More</span>
                    <span className="votes">▲ {p.upvotes} {p.upvotes === 1 ? 'upvote' : 'upvotes'}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
