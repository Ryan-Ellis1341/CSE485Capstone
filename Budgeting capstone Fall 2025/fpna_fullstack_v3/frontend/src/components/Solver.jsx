import React, { useState } from 'react'
export default function Solver({API, auth, role, scenario}){
  const [target, setTarget] = useState(500000)
  const [range, setRange] = useState(0.2)
  const [result, setResult] = useState(null)
  const canEdit = role==='Admin' || role==='Analyst'
  async function run(){
    const r = await fetch(`${API}/solver/goal_seek`, auth({method:'POST', body: JSON.stringify({scenario, target_ebitda: Number(target), search_range: Number(range), apply: false})}))
    const js = await r.json(); setResult(js)
  }
  async function apply(){
    if(!canEdit){ alert('Viewer cannot apply.'); return }
    const r = await fetch(`${API}/solver/goal_seek`, auth({method:'POST', body: JSON.stringify({scenario, target_ebitda: Number(target), search_range: Number(range), apply: true})}))
    const js = await r.json(); setResult(js)
  }
  return (
    <div>
      <h3>Goal Seek — hit target EBITDA</h3>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <label>Target EBITDA <input type="number" value={target} onChange={e=>setTarget(e.target.value)} /></label>
        <label>Search Range ± <input type="number" step="0.01" value={range} onChange={e=>setRange(e.target.value)} /></label>
        <button onClick={run}>Suggest Levers</button>
        <button onClick={apply} disabled={!canEdit}>Apply to Scenario</button>
      </div>
      {result && <div style={{marginTop:12, background:'#f6f8fa', padding:12, borderRadius:8}}>
        <div><b>Best EBITDA:</b> {result.best_ebitda?.toLocaleString()}</div>
        <div><b>Revenue %:</b> {(result.revenue_pct*100).toFixed(1)}%</div>
        <div><b>COGS %:</b> {(result.cogs_pct*100).toFixed(1)}%</div>
        <div><b>Labor %:</b> {(result.labor_pct*100).toFixed(1)}%</div>
        <div><b>Abs Error:</b> {result.abs_error?.toLocaleString()}</div>
        {result.applied_to && <div style={{color:'green'}}>Applied to {result.applied_to}</div>}
      </div>}
    </div>
  )
}
