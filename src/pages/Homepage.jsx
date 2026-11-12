import { Link } from 'react-router-dom'
import Calendar from '../components/Calendar'

function Homepage() {
  return (
    <main className="app">
      <Link to="/" className="back-link">
        &larr; Back
      </Link>
      <Calendar />
    </main>
  )
}

export default Homepage