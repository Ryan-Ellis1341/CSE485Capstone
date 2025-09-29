import React, { useState } from 'react'
export default function Scenarios({API, auth, year=2027, scenario=`${2027}:Base`, setScenario, role}){
  const [pct, setPct] = useState(0.02)
  const [pattern, setPattern] = useState('COGS:*')
  const [startMonth, setStartMonth] = useState(`${year}-06`)
  const [endMonth, setEndMonth] = useState(`${year}-12`)
  const canEdit = role==='Admin' || role==='Analyst'

  async function makeBest(){
    if(!canEdit){ alert('Viewer cannot clone scenarios.'); return }
    await fetch(`${API}/scenario/clone`, auth({method:'POST', body: JSON.stringify({base: `${year}:Base`, to: `${year}:Best`, pct: 0.03})}))
    setScenario(`${year}:Best`)
  }
  async function makeWorst(){
    if(!canEdit){ alert('Viewer cannot clone scenarios.'); return }
    await fetch(`${API}/scenario/clone`, auth({method:'POST', body: JSON.stringify({base: `${year}:Base`, to: `${year}:Worst`, pct: -0.03})}))
    setScenario(`${year}:Worst`)
  }
  async function applySensitivity(){
    if(!canEdit){ alert('Viewer cannot apply sensitivity.'); return }
    await fetch(`${API}/scenario/sensitivity`, auth({method:'POST', body: JSON.stringify({scenario: `${year}:Base`, account_pattern: pattern, start_month: startMonth, end_month: endMonth, pct: Number(pct)})}))
    alert('Applied.')
  }
  return (
    <div>
      <h3>Scenario Planning</h3>
      <div style={{display:'flex', gap:8}}>
        <button onClick={makeBest} disabled={!canEdit}>Clone Best (+3%)</button>
        <button onClick={makeWorst} disabled={!canEdit}>Clone Worst (−3%)</button>
      </div>
      <h4>Sensitivity</h4>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:8, maxWidth:900}}>
        <label>Account Pattern <input value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="COGS:*"/></label>
        <label>Start <input value={startMonth} onChange={e=>setStartMonth(e.target.value)} /></label>
        <label>End <input value={endMonth} onChange={e=>setEndMonth(e.target.value)} /></label>
        <label>Percent <input type="number" step="0.01" value={pct} onChange={e=>setPct(e.target.value)} /></label>
        <button onClick={applySensitivity} style={{alignSelf:'end'}} disabled={!canEdit}>Apply</button>
      </div>
      {!canEdit && <p style={{color:'crimson'}}>Login as Analyst/Admin to edit scenarios.</p>}
    </div>
  )
}
