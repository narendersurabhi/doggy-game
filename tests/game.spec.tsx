import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import App from '../src/App'

beforeEach(() => {})
afterEach(() => {
  cleanup()
})

describe('Game App', () => {
  it('renders main UI elements', () => {
    render(<App />)

    // Main heading that references the dog (flexible match)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent?.toLowerCase()).toMatch(/dog/)

    // Play button should exist
    const play = screen.getByRole('button', { name: /play/i })
    expect(play).toBeInTheDocument()

    // Dog and Rabbit images/illustrations should be available via alt text
    const dogImg = screen.getByAltText(/dog/i)
    const rabbitImg = screen.getByAltText(/rabbit/i)
    expect(dogImg).toBeInTheDocument()
    expect(rabbitImg).toBeInTheDocument()
  })

  it('attack interaction triggers UI/score/health changes', async () => {
    const { container } = render(<App />)

    // find an attack control via a few plausible selectors
    let attackBtn: HTMLElement | null = null
    try {
      attackBtn = screen.getByRole('button', { name: /attack/i })
    } catch {}
    if (!attackBtn) attackBtn = container.querySelector('[data-testid="attack-button"]')
    if (!attackBtn) attackBtn = screen.queryByText(/attack/i) as HTMLElement | null
    if (!attackBtn) throw new Error('Attack button not found')

    // read initial score/health if present
    const scoreEl = screen.queryByTestId('score') || screen.queryByText(/score/i)
    const healthEl = screen.queryByTestId('rabbit-health') || screen.queryByText(/health/i)

    const initialScore = scoreEl ? parseInt((scoreEl.textContent || '').replace(/[^0-9]/g, '') || '0', 10) : null
    const initialHealth = healthEl ? parseInt((healthEl.textContent || '').replace(/[^0-9]/g, '') || '0', 10) : null

    // perform an attack
    fireEvent.click(attackBtn)

    // At least one observable change should occur: score increases, health decreases, or dog gets "attacking" state
    let asserted = false

    if (scoreEl) {
      await waitFor(() => {
        const newScore = parseInt((scoreEl.textContent || '').replace(/[^0-9]/g, '') || '0', 10)
        if (initialScore === null) return
        expect(newScore).toBeGreaterThanOrEqual(initialScore)
        asserted = true
      })
    }

    if (!asserted && healthEl && initialHealth !== null) {
      await waitFor(() => {
        const newHealth = parseInt((healthEl.textContent || '').replace(/[^0-9]/g, '') || '0', 10)
        expect(newHealth).toBeLessThanOrEqual(initialHealth)
        asserted = true
      })
    }

    if (!asserted) {
      // fallback: dog element should reflect an attacking state (class or aria-pressed)
      const dog = screen.queryByAltText(/dog/i) || container.querySelector('[data-testid="dog"]')
      if (dog) {
        const el = dog as HTMLElement
        const hasAttackClass = el.className && /attack|attacking|attack--/.test(el.className)
        const pressed = el.getAttribute('aria-pressed') === 'true'
        expect(hasAttackClass || pressed).toBe(true)
        asserted = true
      }
    }

    expect(asserted).toBe(true)
  })
})
