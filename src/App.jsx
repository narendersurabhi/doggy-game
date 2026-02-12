import React, {useState, useCallback} from 'react'
import Game from './components/Game'
import HUD from './components/HUD'
import Controls from './components/Controls'

export default function App(){
  const [running,setRunning] = useState(false)
  const [pulling,setPulling] = useState(false)
  const [soundOn,setSoundOn] = useState(true)
  const [round,setRound] = useState(1)
  const [score,setScore] = useState({dog:0,rabbit:0})
  const [message,setMessage] = useState('Welcome! Tap and hold Pull to win the tug-of-toy.')

  const start = useCallback(()=>{ setRunning(true); setMessage('Go! Pull to win this round.') },[])
  const pause = useCallback(()=>{ setRunning(false); setPulling(false); setMessage('Paused') },[])

  const handleRoundEnd = useCallback((winner)=>{
    setRunning(false)
    setPulling(false)
    setRound(r=>r+1)
    setScore(s=>({ ...s, [winner]: s[winner]+1 }))
    setMessage(winner=== 'dog' ? 'You won that round! Ready for next?' : 'Rabbit wins this time. Try again!')
  },[])

  return (
    <div style={{fontFamily:'Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#f6f9ff,#eaf2ff)'}}>
      <div style={{width:980,display:'grid',gridTemplateColumns:'1fr 300px',gap:24,padding:28,boxSizing:'border-box'}}>
        <div style={{background:'#fff',borderRadius:14,boxShadow:'0 8px 30px rgba(30,40,80,0.08)',padding:18}}>
          <Game running={running} pulling={pulling} soundOn={soundOn} onRoundEnd={handleRoundEnd} setMessage={setMessage} />
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'#fff',borderRadius:12,padding:14,boxShadow:'0 6px 20px rgba(30,40,80,0.06)'}}>
            <HUD round={round} score={score} message={message} running={running} />
          </div>

          <div style={{background:'#fff',borderRadius:12,padding:14,boxShadow:'0 6px 20px rgba(30,40,80,0.06)'}}>
            <Controls
              running={running}
              onStart={start}
              onPause={pause}
              pulling={pulling}
              setPulling={setPulling}
              soundOn={soundOn}
              setSoundOn={setSoundOn}
            />
          </div>

          <div style={{fontSize:12,color:'#6b7280',padding:10}}>Tips: Hold Pull (or press Space) to exert force. The rabbit is playful — it's a friendly tug-of-toy!</div>
        </div>
      </div>
    </div>
  )
}
