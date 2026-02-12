import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function Dog({ x }) {
  return (
    <svg className="pet dog" viewBox="0 0 120 80" style={{ '--x': x + '%' }}>
      <g>
        <ellipse cx="30" cy="50" rx="22" ry="16" fill="#E89A6A" />
        <circle cx="18" cy="36" r="6" fill="#E89A6A" />
        <circle cx="12" cy="34" r="3" fill="#000" />
        <circle cx="36" cy="34" r="3" fill="#000" />
        <rect x="6" y="54" width="8" height="10" rx="3" fill="#E89A6A" />
        <rect x="40" y="54" width="8" height="10" rx="3" fill="#E89A6A" />
      </g>
    </svg>
  )
}

function Rabbit({ x }) {
  return (
    <svg className="pet rabbit" viewBox="0 0 120 80" style={{ '--x': x + '%' }}>
      <g>
        <ellipse cx="90" cy="50" rx="18" ry="14" fill="#F2F2F2" />
        <ellipse cx="98" cy="30" rx="6" ry="12" fill="#F2F2F2" transform="rotate(-20 98 30)" />
        <ellipse cx="82" cy="30" rx="6" ry="12" fill="#F2F2F2" transform="rotate(20 82 30)" />
        <circle cx="86" cy="46" r="3" fill="#000" />
        <rect x="80" y="58" width="6" height="10" rx="3" fill="#F2F2F2" />
        <rect x="96" y="58" width="6" height="10" rx="3" fill="#F2F2F2" />
      </g>
    </svg>
  )
}

export default function App() {
  const [progress, setProgress] = useState(50) // 0 = rabbit wins (right), 100 = dog wins (left)
  const [message, setMessage] = useState('Tug gently!')
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (progress >= 90) {
      setMessage('Doggo wins! Friendly victory 🐶✨')
      setDisabled(true)
    } else if (progress <= 10) {
      setMessage('Rabbit slips away! Hop hooray 🐰🌿')
      setDisabled(true)
    } else {
      setMessage('Tug gently!')
    }
  }, [progress])

  function tug() {
    if (disabled) return
    const dogPull = Math.floor(Math.random() * 14) + 6 // 6-19
    const rabbitCounter = Math.random() < 0.35 ? Math.floor(Math.random() * 10) : 0
    setProgress(p => Math.max(0, Math.min(100, p + dogPull - rabbitCounter)))
  }

  function reset() {
    setProgress(50)
    setDisabled(false)
    setMessage('Tug gently!')
  }

  const dogX = 50 - progress / 2 // move left as progress increases
  const rabbitX = 50 + (100 - progress) / 2

  return (
    <div className="app">
      <header className="top">
        <h1>Doggo Tug</h1>
        <p className="subtitle">A wholesome tug-of-war: playful, kind, and cheerful.</p>
      </header>

      <main>
        <div className="arena">
          <Dog x={dogX} />
          <Rabbit x={rabbitX} />
          <div className="rope" style={{ left: `calc(${dogX}% + 70px)`, right: `calc(${100 - rabbitX}% + 70px)` }}>
            <div className="tugbar" style={{ transform: `translateX(${(progress - 50) / 2}%)` }} />
          </div>
        </div>

        <div className="controls">
          <div className="meter">
            <div className="fill" style={{ width: progress + '%' }} />
          </div>
          <div className="buttons">
            <button onClick={tug} disabled={disabled}>Tug!</button>
            <button onClick={reset}>Reset</button>
          </div>
          <div className="message">{message}</div>
        </div>
      </main>

      <footer>
        <small>Made with kindness — no harm, just fun.</small>
      </footer>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
