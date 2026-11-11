import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostForm from './pages/PostForm.jsx'
import PageHero from './components/PageHero.jsx'

export default function App() {
  return (
    <>
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span>✈ A forum for pilots, student pilots &amp; plane spotters</span>
          <span className="topbar-right">Blue skies &amp; tailwinds</span>
        </div>
      </div>

      <header className="header">
        <div className="wrap header-inner">
          <Link to="/" className="brand">
            <span className="brand-accent">SKY</span>HUB
          </Link>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/new" className="btn btn-sm">New Post</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<PostForm />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/:id/edit" element={<PostForm />} />
          <Route
            path="*"
            element={
              <>
                <PageHero title="Off course" subtitle="That page doesn't exist." />
                <div className="wrap section center"><Link to="/" className="btn">Back to the feed</Link></div>
              </>
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div>
            <h2 className="footer-title">Got a story from the flight line?</h2>
            <p className="text">
              First solo, a checkride tip, or a great spotting photo — share it with the community.
            </p>
          </div>
          <div className="footer-cta">
            <p className="footer-cta-label">Start a discussion</p>
            <Link to="/new" className="btn btn-block">Write a post</Link>
          </div>
        </div>
        <p className="wrap copyright">© {new Date().getFullYear()} SkyHub</p>
      </footer>
    </>
  )
}
