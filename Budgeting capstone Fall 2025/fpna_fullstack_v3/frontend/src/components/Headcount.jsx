import React, { useEffect, useState } from 'react'
export default function Headcount({API, auth, role, year, scenario}){
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({emp_id:'E1', name:'New Hire', dept:'Ops', start_month:`${year}-06`, annual_salary:52000, fte:1, raise_month:'', raise_pct:0.05, benefits_pct:0.08, taxes_pct:0.076, currency:'USD'})
  const canEdit = role==='Admin' || role==='Analyst'
  async function load(){ const r = await fetch(`${API}/headcount/list`, auth({})); const js = await r.json(); setRows(js.rows||[]) }
  useEffect(()=>{ load() }, [API])
  async function upsert(){
    if(!canEdit){ alert('Viewer cannot edit headcount.'); return }
    const payload = {...form}; if(!payload.raise_month) delete payload.raise_month
    const r = await fetch(`${API}/headcount/upsert`, auth({method:'POST', body: JSON.stringify(payload)})); await r.json(); load()
  }
  async function bake(){
    if(!canEdit){ alert('Viewer cannot bake.'); return }
    const r = await fetch(`${API}/headcount/bake_to_budget`, auth({method:'POST', body: JSON.stringify({fiscal_year: Number(year), scenario, apply:true})}))
    const js = await r.json(); alert('Applied rows: ' + js.applied_rows)
  }
  return (
    <div>
      <h3>Headcount & Payroll</h3>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
        <label>Emp ID <input value={form.emp_id} onChange={e=>setForm({...form, emp_id:e.target.value})} /></label>
        <label>Name <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></label>
        <label>Dept 
          <select value={form.dept} onChange={e=>setForm({...form, dept:e.target.value})}>
            <option>Sales</option><option>Ops</option><option>HQ</option>
          </select>
        </label>
        <label>Start YYYY-MM <input value={form.start_month} onChange={e=>setForm({...form, start_month:e.target.value})} /></label>
        <label>Annual Salary <input type="number" value={form.annual_salary} onChange={e=>setForm({...form, annual_salary:Number(e.target.value)})} /></label>
        <label>FTE <input type="number" step="0.1" value={form.fte} onChange={e=>setForm({...form, fte:Number(e.target.value)})} /></label>
        <label>Raise Month <input placeholder="YYYY-MM" value={form.raise_month} onChange={e=>setForm({...form, raise_month:e.target.value})} /></label>
        <label>Raise % <input type="number" step="0.01" value={form.raise_pct} onChange={e=>setForm({...form, raise_pct:Number(e.target.value)})} /></label>
        <label>Benefits % <input type="number" step="0.01" value={form.benefits_pct} onChange={e=>setForm({...form, benefits_pct:Number(e.target.value)})} /></label>
        <label>Taxes % <input type="number" step="0.01" value={form.taxes_pct} onChange={e=>setForm({...form, taxes_pct:Number(e.target.value)})} /></label>
        <label>Currency <input value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})} /></label>
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={upsert} disabled={!canEdit}>Upsert Employee</button>
        <button onClick={bake} disabled={!canEdit}>Bake to Budget ({year})</button>
      </div>
      <h4 style={{marginTop:16}}>Roster</h4>
      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th>Emp</th><th>Name</th><th>Dept</th><th>Start</th><th>Salary</th><th>FTE</th><th>Raise</th></tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={i} style={{borderTop:'1px solid #eee'}}>
            <td>{r.emp_id}</td><td>{r.name}</td><td>{r.dept}</td><td>{r.start_month}</td><td>{r.annual_salary}</td><td>{r.fte}</td><td>{r.raise_month ? `${r.raise_month} @ ${r.raise_pct}`:''}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}
