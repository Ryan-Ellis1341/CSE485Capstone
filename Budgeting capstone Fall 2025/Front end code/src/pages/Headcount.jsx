import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'
export default function Headcount({api, token}){
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({emp_id:'E100', name:'New Hire', dept:'Ops', start_month:'2027-06', annual_salary:52000, fte:1.0, raise_month:'2027-09', raise_pct:0.05, benefits_pct:0.08, taxes_pct:0.076, currency:'USD'})
  const [year, setYear] = useState(2027); const [scenario, setScenario] = useState('2027:Base'); const [msg, setMsg] = useState('')
  async function load(){ const client = makeClient(api, token); const { data } = await client.get('/headcount/list'); setRows(data.rows || []) }
  async function upsert(){ try{ const client=makeClient(api, token); await client.post('/headcount/upsert', form); setMsg('Saved.'); load() }catch(e){ setMsg(String(e.response?.data || e.message)) } }
  async function bake(){ try{ const client=makeClient(api, token); const {data}=await client.post('/headcount/bake_to_budget', { fiscal_year:year, scenario, apply:true }); setMsg(`Baked ${data.applied_rows} rows.`) }catch(e){ setMsg(String(e.response?.data || e.message)) } }
  useEffect(()=>{ load() }, [])
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Headcount</h2>
    <div className="grid md:grid-cols-2 gap-3 mt-2">
      <div><label className="text-xs text-slate-500">Employee JSON</label><textarea className="border rounded w-full h-56 p-2" value={JSON.stringify(form,null,2)} onChange={e=>setForm(JSON.parse(e.target.value))}/>
        <div className="flex gap-2 mt-2"><button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={upsert}>Upsert</button><button className="px-3 py-1 rounded border" onClick={load}>Refresh</button></div>
      </div>
      <div><label className="text-xs text-slate-500">Roster</label>
        <div className="border rounded h-56 overflow-auto p-2">
          <table className="w-full text-sm"><thead><tr><th>emp_id</th><th>name</th><th>dept</th><th>start</th><th>salary</th></tr></thead>
          <tbody>{rows.map((r,i)=>(<tr key={i}><td>{r.emp_id}</td><td>{r.name}</td><td>{r.dept}</td><td>{r.start_month}</td><td>{r.annual_salary}</td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
    <div className="flex gap-3 items-end mt-3">
      <div><label className="text-xs text-slate-500">Fiscal Year</label><input className="border rounded px-2 py-1 w-24" type="number" value={year} onChange={e=>setYear(Number(e.target.value))}/></div>
      <div><label className="text-xs text-slate-500">Scenario</label><input className="border rounded px-2 py-1 w-44" value={scenario} onChange={e=>setScenario(e.target.value)}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={bake}>Bake to Budget</button>
    </div>
    {msg && <div className="mt-2 p-2 rounded bg-yellow-50 border text-sm">{msg}</div>}
    <div className="mt-2 text-sm text-slate-500">Note: endpoints in the single-file backend (app_super_v3).</div>
  </div>) }