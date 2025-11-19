import React, { useState } from 'react'
import { makeClient } from '../api'
export default function SetupWizard({api, token, year, scenario}){
  const [form, setForm] = useState({ year, scenario, store_name:'Store-1', avg_ticket:12, daily_customers:300, open_days:360, cogs_pct:0.42, labor_pct:0.25, rent_monthly:5000, utilities_monthly:1200, royalty_pct:0.06, adfund_pct:0.04, currency:'USD', fx_as_of:'2027-01-01', fx_from:'EUR', fx_to:'USD', fx_rate:1.1, asset_name:'Oven', asset_dept:'Ops', asset_purchase:`${year}-02`, asset_amount:12000, asset_life:60, asset_salvage:0, hc_emp_id:'E100', hc_name:'Crew', hc_dept:'Ops', hc_start:`${year}-03`, hc_salary:52000, hc_fte:1.0, hc_ben:0.1, hc_tax:0.08 })
  const on = (k,v)=> setForm(prev=>({...prev, [k]: v}))
  async function run(){ const client = makeClient(api, token); const { data } = await client.post('/setup/run', form); alert('Setup complete. Rows created: '+data.created_rows) }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">Guided Setup Wizard (Preset → FX → Assets → Headcount)</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{Object.keys(form).map(k=> (<div key={k}><label className="text-sm">{k}</label><input className="border rounded px-2 py-1 w-full" value={form[k]} onChange={e=>on(k, e.target.value)} /></div>))}</div>
      <button onClick={run} className="px-3 py-2 rounded bg-slate-900 text-white">Run Setup</button>
      <div className="text-xs text-slate-500">After this, open Dashboard → BvA → Forecast to explore your data.</div>
    </div>
  )
}