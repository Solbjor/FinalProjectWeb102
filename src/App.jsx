import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostForm from './pages/PostForm.jsx'

export default function App() {
  return (
    <>
      <header className="nav">
        <Link to="/" className="brand">✈ SkyHub</Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/new">New Post</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<PostForm />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/:id/edit" element={<PostForm />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}
