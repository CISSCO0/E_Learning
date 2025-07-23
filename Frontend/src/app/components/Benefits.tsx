import './Benefits.css'

const benefits = [
  "Learn at your own pace",
  "Access to expert instructors",
  "Diverse range of courses",
  "Interactive learning experiences",
  "Certificates of completion",
  "Lifetime access to course materials",
]

export default function Benefits() {
  return (
    <section className="benefits">
      <div className="container">
        <h2>Why Choose Our Platform?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <span className="check-icon">✓</span>
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

