import { Link } from 'react-router-dom'
import './Landing.css'

// For now every card points to the Homepage ("/home").
// Later, change each card's `to` to its own route.
const CARDS = [
  { id: 1, title: 'card one', description: 'short description goes here.', to: '/home' },
  { id: 2, title: 'card two', description: 'short description goes here.', to: '/home' },
  { id: 3, title: 'card three', description: 'short description goes here.', to: '/home' },
  { id: 4, title: 'card four', description: 'short description goes here.', to: '/home' },
]

function Landing() {
  return (
    <main className="landing">
      <div className="landing__grid">
        {CARDS.map((card) => (
          <Link key={card.id} to={card.to} className="landing__card">
            <h2 className="landing__card-title">{card.title}</h2>
            <p className="landing__card-text">{card.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Landing