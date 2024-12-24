import Link from "next/link"
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Unlock Your Potential with Online Learning</h1>
        <p>Discover courses taught by industry experts and take your skills to the next level</p>
        <Link href="/courses" className="btn">Explore Courses</Link>
      </div>
    </section>
  )
}

