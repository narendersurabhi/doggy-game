import React, { useEffect, useRef, useState } from 'react'

const CLAMP = (v:number,a:number,b:number)=>Math.max(a,Math.min(b,v))

export default function App(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const [running,setRunning] = useState(false)
  const [message,setMessage] = useState('Press Space / Tap / Click to tug!')
  const [tugs,setTugs] = useState(0)
  const posRef = useRef(0.5) // 0 left rabbit, 1 right dog
  const velRef = useRef(0)
  const dogForceRef = useRef(0)
  const rabbitForceRef = useRef(0.3) // baseline resistance
  const lastTugRef = useRef(0)

  useEffect(()=>{
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    let raf = 0
    let last = performance.now()
    function resize(){
      const dpr = window.devicePixelRatio || 1
      c.width = Math.floor(c.clientWidth * dpr)
      c.height = Math.floor(c.clientHeight * dpr)
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    resize()
    window.addEventListener('resize', resize)

    function step(t:number){
      const dt = Math.min(32, t - last) / 1000
      last = t
      // simple physics
      // dog force decays
      dogForceRef.current *= Math.pow(0.85, dt*60)
      // rabbit AI: periodically jerk back
      if(Math.random() < 0.02 + 0.015*(1-posRef.current)){
        rabbitForceRef.current = 0.2 + Math.random()*0.5
      } else {
        rabbitForceRef.current *= 0.96
        rabbitForceRef.current = Math.max(0.12, rabbitForceRef.current)
      }
      const force = dogForceRef.current - rabbitForceRef.current
      velRef.current += force * dt * 3
      velRef.current *= Math.pow(0.9, dt*60)
      posRef.current = CLAMP(posRef.current + velRef.current*dt, 0, 1)

      // win/lose
      if(posRef.current >= 0.92){
        setRunning(false)
        setMessage('Doggo wins! Play again?')
      } else if(posRef.current <= 0.08){
        setRunning(false)
        setMessage('Rabbit holds on! Try again?')
      }

      draw()
      if(running) raf = requestAnimationFrame(step)
    }

    function draw(){
      const W = c.clientWidth, H = c.clientHeight
      ctx.clearRect(0,0,W,H)
      // background
      const g = ctx.createLinearGradient(0,0,0,H)
      g.addColorStop(0,'#ffefd5')
      g.addColorStop(1,'#fff3f8')
      ctx.fillStyle = g
      ctx.fillRect(0,0,W,H)

      // ground
      ctx.fillStyle = '#d6f5d6'
      ctx.fillRect(0, H*0.75, W, H*0.25)

      // positions
      const margin = 60
      const leftX = margin
      const rightX = W - margin
      const midY = H*0.55
      const ropeX = leftX + (rightX-leftX)*posRef.current

      // rope
      ctx.strokeStyle = '#8b5a2b'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(leftX, midY)
      ctx.quadraticCurveTo((leftX+rightX)/2, midY-40*(1-posRef.current), rightX, midY)
      ctx.stroke()

      // toy at rope center
      ctx.fillStyle = '#ff6b6b'
      ctx.beginPath()
      ctx.ellipse(ropeX, midY-6, 12, 10, 0, 0, Math.PI*2)
      ctx.fill()

      // rabbit (left)
      drawBunny(ctx, leftX-10, midY+24, 1)
      // dog (right)
      drawDog(ctx, rightX+10, midY+24, -1)

      // HUD
      ctx.fillStyle = '#222'
      ctx.font = '600 18px system-ui, Roboto, Arial'
      ctx.fillText(`Tugs: ${tugs}`, 18, 28)
      ctx.font = '500 14px system-ui'
      ctx.fillText(message, 18, 50)
    }

    function startLoop(){
      last = performance.now()
      setMessage('Tug! (Space / Click / Tap)')
      if(!raf) raf = requestAnimationFrame(step)
    }

    if(running) startLoop()

    return ()=>{
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [running, tugs, message])

  useEffect(()=>{
    function onKey(e:KeyboardEvent){
      if(e.code === 'Space') triggerTug()
      if(e.key === 'r' || e.key === 'R') reset()
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  }, [])

  function triggerTug(){
    if(!running){
      setRunning(true)
      setMessage('Go! Keep tapping to pull!')
    }
    dogForceRef.current += 0.45 + Math.random()*0.25
    // small visual burst via lastTug
    lastTugRef.current = performance.now()
    setTugs(s=>s+1)
  }

  function reset(){
    posRef.current = 0.5
    velRef.current = 0
    dogForceRef.current = 0
    rabbitForceRef.current = 0.3
    setTugs(0)
    setRunning(false)
    setMessage('Press Space / Tap / Click to tug!')
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Doggo Tug</h1>
        <p className="subtitle">Friendly tug-of-war: help the dog pull the toy! (No harm, all fun 🐶🐰)</p>
        <div className="canvasWrap" onClick={()=>triggerTug()}>
          <canvas ref={canvasRef} className="gameCanvas" />
        </div>
        <div className="controls">
          <button onClick={()=>triggerTug()} className="btn">Tug!</button>
          <button onClick={()=>reset()} className="btn ghost">Reset</button>
          <div className="hint">Space / Click / Tap to tug • R to reset</div>
        </div>
      </div>
    </div>
  )
}

function drawBunny(ctx:CanvasRenderingContext2D, x:number, y:number, dir:number){
  ctx.save()
  ctx.translate(x,y)
  ctx.scale(1,1)
  // body
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.ellipse(0,6,22,18,0,0,Math.PI*2); ctx.fill();
  // head
  ctx.beginPath(); ctx.ellipse(-20,-6,12,12,0,0,Math.PI*2); ctx.fill();
  // ears
  ctx.fillStyle='#ffe'; ctx.beginPath(); ctx.ellipse(-25,-26,6,16,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-15,-26,6,16,0,0,Math.PI*2); ctx.fill();
  // eye
  ctx.fillStyle='#222'; ctx.beginPath(); ctx.ellipse(-22,-8,2.5,3,0,0,Math.PI*2); ctx.fill();
  // nose
  ctx.fillStyle='#ff9ab0'; ctx.beginPath(); ctx.ellipse(-18,-2,3,2.5,0,0,Math.PI*2); ctx.fill();
  ctx.restore()
}

function drawDog(ctx:CanvasRenderingContext2D, x:number, y:number, dir:number){
  ctx.save()
  ctx.translate(x,y)
  // body
  ctx.fillStyle='#f6d365'
  ctx.beginPath(); ctx.ellipse(0,6,26,18,0,0,Math.PI*2); ctx.fill();
  // head
  ctx.fillStyle='#ffb86b'
  ctx.beginPath(); ctx.ellipse(20,-6,14,14,0,0,Math.PI*2); ctx.fill();
  // ear
  ctx.fillStyle='#d98a3a'; ctx.beginPath(); ctx.ellipse(27,-18,6,12,0,0,Math.PI*2); ctx.fill();
  // eye
  ctx.fillStyle='#222'; ctx.beginPath(); ctx.ellipse(22,-8,2.8,3.2,0,0,Math.PI*2); ctx.fill();
  // mouth smile
  ctx.strokeStyle='#b35'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(24,-0,6,0.2,Math.PI-0.2); ctx.stroke();
  ctx.restore()
}
