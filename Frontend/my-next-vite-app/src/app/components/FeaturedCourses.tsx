import Link from "next/link"
import './FeaturedCourses.css'

const courses = [
  { id: 1, title: "Introduction to Web Development", description: "Learn the basics of HTML, CSS, and JavaScript", price: "$49.99" },
  { id: 2, title: "Data Science Fundamentals", description: "Master the core concepts of data analysis and visualization", price: "$59.99" },
  { id: 3, title: "Digital Marketing Essentials", description: "Discover key strategies for online marketing success", price: "$39.99" },
]

export default function FeaturedCourses() {
  return (
    <section className="featured-courses">
      <div className="container">
        <h2>Featured Courses</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p className="price">{course.price}</p>
              <Link href={`/courses/${course.id}`} className="btn">Learn More</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

