import Link from "next/link"
import './CTA.css'

export default function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join thousands of students already learning on our platform</p>
        <Link href="/auth/signUp" className="btn btn-large">Get Started Today</Link>
      </div>
    </section>
  )
}

