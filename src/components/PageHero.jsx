export default function PageHero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1>{title}</h1>
        {subtitle && <p className="hero-sub">{subtitle}</p>}
      </div>
    </section>
  )
}
