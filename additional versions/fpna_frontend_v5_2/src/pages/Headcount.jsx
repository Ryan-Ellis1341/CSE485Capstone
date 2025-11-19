import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Headcount({api, token, year, scenario}){
  const [row, setRow] = useState({emp_id:'E100',name:'New Hire',dept:'Ops',start_month:`${year}-06`,annual_salary:52000, fte:1, benefits_pct:0.1, taxes_pct:0.08})
  async function add(){ const client = makeClient(api, token); await client.post('/headcount/upsert', row); alert('Added') }
  async function bake(){ const client = makeClient(api, token); const { data } = await client.post('/headcount/bake_to_budget', { fiscal_year: year, scenario, apply: true }); alert('Applied rows: ' + data.applied_rows) }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">Headcount / Payroll Planning</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.keys(row).map(k=> (
          <div key={k}><label className="text-sm">{k}</label><input className="border rounded px-2 py-1 w-full" value={row[k]} onChange={e=>setRow(prev=>({...prev, [k]: e.target.value}))}/></div>
        ))}
      </div>
      <div className="flex gap-3"><button onClick={add} className="px-3 py-2 rounded bg-slate-900 text-white">Add</button><button onClick={bake} className="px-3 py-2 rounded border">Bake to Budget</button></div>
    </div>
  )
}