import { useEffect, useState } from 'react'
import './Calendar.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const pad = (n) => String(n).padStart(2, '0')

// Notes are keyed by "YYYY-MM-DD" (month is 0-based in, 1-based out).
export const toDateKey = (year, month, day) =>
  `${year}-${pad(month + 1)}-${pad(day)}`

function DayCell({ day, dateKey, value, isToday, onCommit }) {
  const [draft, setDraft] = useState(value)

  // Keep the draft in sync when notes are loaded or changed from outside.
  useEffect(() => {
    setDraft(value)
  }, [value])

  const commit = () => {
    if (draft !== value) onCommit(dateKey, draft)
  }

  return (
    <div className={`calendar__cell${isToday ? ' calendar__cell--today' : ''}`}>
      <span className="calendar__day-number">{day}</span>
      <textarea
        className="calendar__note"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        aria-label={`Notes for ${dateKey}`}
      />
    </div>
  )
}

/**
 * Props (all optional):
 * - notes:         { 'YYYY-MM-DD': 'text' }. If provided, the calendar is controlled.
 * - onNoteChange:  (dateKey, text) => void. Fires when a day's note loses focus after a change.
 * - onMonthChange: (year, month) => void. Fires on prev/next (month is 0-based).
 * - initialDate:   Date used to pick the starting month. Defaults to today.
 */
export default function Calendar({
  notes,
  onNoteChange,
  onMonthChange,
  initialDate,
}) {
  const [view, setView] = useState(() => {
    const d = initialDate ?? new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [localNotes, setLocalNotes] = useState({})

  const isControlled = notes !== undefined
  const data = isControlled ? notes : localNotes

  const { year, month } = view
  const today = new Date()
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const goToMonth = (delta) => {
    const next = new Date(year, month + delta, 1)
    const nextView = { year: next.getFullYear(), month: next.getMonth() }
    setView(nextView)
    onMonthChange?.(nextView.year, nextView.month)
  }

  const handleCommit = (dateKey, text) => {
    if (!isControlled) {
      setLocalNotes((prev) => ({ ...prev, [dateKey]: text }))
    }
    onNoteChange?.(dateKey, text)
  }

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const day = i - firstWeekday + 1
    if (day < 1 || day > daysInMonth) {
      cells.push(<div key={`blank-${i}`} className="calendar__cell calendar__cell--blank" />)
      continue
    }
    const dateKey = toDateKey(year, month, day)
    cells.push(
      <DayCell
        key={dateKey}
        day={day}
        dateKey={dateKey}
        value={data[dateKey] ?? ''}
        isToday={dateKey === todayKey}
        onCommit={handleCommit}
      />,
    )
  }

  return (
    <section className="calendar">
      <header className="calendar__header">
        <button type="button" onClick={() => goToMonth(-1)} aria-label="Previous month">
          &#8249;
        </button>
        <h2 className="calendar__title">{monthLabel}</h2>
        <button type="button" onClick={() => goToMonth(1)} aria-label="Next month">
          &#8250;
        </button>
      </header>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((d) => (
          <div key={d} className="calendar__weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar__grid">{cells}</div>
    </section>
  )
}