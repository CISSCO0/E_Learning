import CourseList from './components/CourseList'
import './courses.css'

export default function CoursesPage() {
  return (
    <div className="courses-page">
      <header>
        <h1>Our Courses</h1>
      </header>
      <main>
        <CourseList />
      </main>
    </div>
  )
}

