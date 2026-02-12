import React, {useRef, useEffect, useState} from 'react'

export default function Game({running,pulling,soundOn,onRoundEnd,setMessage}){
  const rafRef = useRef(null)
  const posRef = useRef(0) // -1 (rabbit) .. 1 (dog)
  const [pos,setPos] = useState(0)
  const [timeLeft,setTimeLeft] = useState(30)
  const winThreshold = 0.9

  useEffect(()=>{
    if(!running){
      cancelAnimationFrame(rafRef.current||0)
      return
    }
    let last = performance.now()
    setTimeLeft(30)
    posRef.current = 0
    function step(now){
      const dt = Math.min(0.1,(now-last)/1000)
      last = now
      // forces
      const baseRabbit = 0.35
      const rabbitAdapt = 0.15 * Math.sin(now/4000)
      const rabbitForce = baseRabbit + rabbitAdapt
      const dogBase = 0.15
      const dogBonus = pulling ? 0.55 : 0
      const dogForce = dogBase + dogBonus
      // apply
      posRef.current += (dogForce - rabbitForce) * dt
      posRef.current = Math.max(-1,Math.min(1,posRef.current))
      setPos(posRef.current)
      // time
      setTimeLeft(t=>{
        const nt = t - dt
        if(nt<=0){
          // time up: decide winner by position
          const winner = posRef.current>=0 ? 'dog':'rabbit'
          onRoundEnd(winner)
          setMessage('Time up!')
          cancelAnimationFrame(rafRef.current||0)
          return 0
        }
        return nt
      })
      // check threshold
      if(posRef.current>=winThreshold){ onRoundEnd('dog'); setMessage('Dog pulled the toy!') ; return }
      if(posRef.current<=-winThreshold){ onRoundEnd('rabbit'); setMessage('Rabbit won the tug!') ; return }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)

    return ()=> cancelAnimationFrame(rafRef.current||0)
  },[running,pulling,onRoundEnd,setMessage])

  // visual metrics
  const trackW = 640
  const center = trackW/2
  const handleX = center + pos* (trackW/2 - 48)

  return (
    <div style={{padding:18}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:28}}>🐶</div>
          <div style={{fontSize:14,fontWeight:600}}>You (Dog)</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:14,fontWeight:600,textAlign:'right'}}>Rabbit</div>
          <div style={{fontSize:28}}>🐰</div>
        </div>
      </div>

      <div style={{position:'relative',height:140,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:trackW,height:12,background:'linear-gradient(90deg,#fde68a,#fca5a5)',borderRadius:999,boxShadow:'inset 0 3px 8px rgba(0,0,0,0.06)'}} />

        <div style={{position:'absolute',left:12,top:10,width:46,height:46,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>
          <div style={{transform:`translateX(${(pos*40)}px)`,transition:'transform 0.06s linear'}}>🐶</div>
        </div>

        <div style={{position:'absolute',right:12,top:10,width:46,height:46,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>
          <div style={{transform:`translateX(${(pos*40)}px)`,transition:'transform 0.06s linear'}}>🐰</div>
        </div>

        <div style={{position:'absolute',top:46,left:handleX-22,width:44,height:44,background:'#fff',borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 18px rgba(30,40,80,0.08)'}}>
          <div style={{fontWeight:700,color:'#111'}}>🧸</div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{width:160,height:10,background:'#eef2ff',borderRadius:999,overflow:'hidden'}}>
            <div style={{width:`${(pos+1)/2*100}%`,height:'100%',background:'linear-gradient(90deg,#60a5fa,#7c3aed)'}} />
          </div>
          <div style={{fontSize:13,color:'#374151'}}>{Math.round((pos+1)/2*100)}% advantage</div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:13,color:'#6b7280'}}>Time</div>
          <div style={{background:'#f3f4f6',padding:'6px 10px',borderRadius:8,fontWeight:700}}>{Math.max(0,Math.round(timeLeft))}s</div>
        </div>
      </div>
    </div>
  )
}
