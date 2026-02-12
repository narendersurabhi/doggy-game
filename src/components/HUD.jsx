import React from 'react'

export default function HUD({round,score,message,running}){
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <div style={{fontSize:12,color:'#6b7280'}}>Round</div>
          <div style={{fontSize:20,fontWeight:700}}>{round}</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:12,color:'#6b7280'}}>Score</div>
          <div style={{fontSize:18,fontWeight:700}}>{score.dog} — {score.rabbit}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12,color:'#6b7280'}}>Status</div>
          <div style={{fontSize:14,fontWeight:600,color: running ? '#059669' : '#b91c1c'}}>{running ? 'Playing' : 'Idle'}</div>
        </div>
      </div>

      <div style={{padding:12,background:'linear-gradient(90deg,#fff,#fbfdff)',borderRadius:10,border:'1px solid rgba(99,102,241,0.06)'}}>
        <div style={{fontSize:13,color:'#374151',fontWeight:600,marginBottom:6}}>Feed</div>
        <div style={{fontSize:13,color:'#6b7280'}}>{message}</div>
      </div>
    </div>
  )
}
