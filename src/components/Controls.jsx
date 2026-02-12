import React, {useEffect} from 'react'

export default function Controls({running,onStart,onPause,pulling,setPulling,soundOn,setSoundOn}){
  useEffect(()=>{
    function onKey(e){
      if(e.code==='Space'){ e.preventDefault(); setPulling(true) }
    }
    function onKeyUp(e){ if(e.code==='Space'){ setPulling(false) } }
    window.addEventListener('keydown',onKey)
    window.addEventListener('keyup',onKeyUp)
    return ()=>{ window.removeEventListener('keydown',onKey); window.removeEventListener('keyup',onKeyUp) }
  },[setPulling])

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:10}}>
        <button onClick={running?onPause:onStart} style={{flex:1,padding:'10px 12px',borderRadius:10,border:0,background: running? '#f97316' : '#4f46e5',color:'#fff',fontWeight:700,cursor:'pointer'}}> {running? 'Pause' : 'Start'} </button>
        <button onClick={()=>{setSoundOn(s=>!s)}} style={{padding:'10px 12px',borderRadius:10,border:'1px solid #e6e9f2',background:'#fff',cursor:'pointer'}}>{soundOn? '🔊' : '🔈'}</button>
      </div>

      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <button
          onMouseDown={()=>setPulling(true)}
          onMouseUp={()=>setPulling(false)}
          onMouseLeave={()=>setPulling(false)}
          onTouchStart={()=>setPulling(true)}
          onTouchEnd={()=>setPulling(false)}
          style={{flex:1,padding:'12px',borderRadius:10,border:0,background:'linear-gradient(90deg,#06b6d4,#4f46e5)',color:'#fff',fontWeight:800,fontSize:16,cursor:'pointer'}}>
          Pull
        </button>
        <div style={{width:110,fontSize:12,color:'#6b7280',textAlign:'center'}}>Hold or press Space</div>
      </div>

      <div style={{fontSize:12,color:'#6b7280'}}>Accessible controls, responsive layout, and playful, friendly interactions.</div>
    </div>
  )
}
