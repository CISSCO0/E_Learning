import Hero from './components/Hero'
import FeaturedCourses from './components/FeaturedCourses'
import Benefits from './components/Benefits'
import CTA from './components/CTA'
import './woa.css'
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturedCourses />
      <Benefits />
      <CTA />
    </div>
  )
}

