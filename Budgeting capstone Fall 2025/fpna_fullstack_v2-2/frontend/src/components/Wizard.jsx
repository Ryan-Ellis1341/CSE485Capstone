import React, { useState } from 'react'

export default function Wizard({API, auth, role, onDone}){
  const [year, setYear] = useState(2026)
  const [avgTicket, setAvgTicket] = useState(14)
  const [dailyTxn, setDailyTxn] = useState(380)
  const [laborPct, setLaborPct] = useState(0.26)
  const [gdp, setGdp] = useState(0.02)
  const [loading, setLoading] = useState(false)

  const canEdit = role==='Admin' || role==='Analyst'

  async function create(){
    if(!canEdit){ alert('Viewer cannot create presets. Switch to Analyst or Admin.'); return }
    setLoading(true)
    const payload = {
      fiscal_year: Number(year),
      gdp_growth: Number(gdp),
      overrides: {avg_ticket: Number(avgTicket), daily_txn: Number(dailyTxn), labor_pct: Number(laborPct)}
    }
    const r = await fetch(`${API}/preset/qsr`, auth({method:'POST', body: JSON.stringify(payload)}))
    const js = await r.json()
    setLoading(false)
    onDone?.(year)
  }

  return (
    <div>
      <h3>5‑Minute Setup Wizard (QSR)</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:720}}>
        <label>Year <input type="number" value={year} onChange={e=>setYear(e.target.value)} /></label>
        <label>Avg Ticket <input type="number" value={avgTicket} onChange={e=>setAvgTicket(e.target.value)} /></label>
        <label>Daily Transactions <input type="number" value={dailyTxn} onChange={e=>setDailyTxn(e.target.value)} /></label>
        <label>Labor % of Sales <input type="number" step="0.01" value={laborPct} onChange={e=>setLaborPct(e.target.value)} /></label>
        <label>GDP Growth (annual) <input type="number" step="0.01" value={gdp} onChange={e=>setGdp(e.target.value)} /></label>
      </div>
      <button onClick={create} disabled={loading || !canEdit} style={{marginTop:12}}>{loading?'Creating…':'Create Budget'}</button>
      {!canEdit && <p style={{color:'crimson'}}>Login as Analyst/Admin to create budgets.</p>}
    </div>
  )
}
