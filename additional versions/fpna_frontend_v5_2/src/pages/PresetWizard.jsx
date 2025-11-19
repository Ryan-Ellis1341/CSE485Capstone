import React, { useState } from 'react'
import { makeClient } from '../api'
export default function PresetWizard({api, token, year, scenario}){
  const [form, setForm] = useState({ year, scenario, store_name:'Store-1', avg_ticket:12, daily_customers:300, open_days:360, cogs_pct:0.42, labor_pct:0.25, rent_monthly:5000, utilities_monthly:1200, royalty_pct:0.06, adfund_pct:0.04, currency:'USD', apply:true })
  const [sample, setSample] = useState([])
  const [count, setCount] = useState(0)
  const on = (k,v)=> setForm(prev=>({...prev, [k]: v}))
  async function run(){ const client = makeClient(api, token); const { data } = await client.post('/presets/qsr', form); setCount(data.rows); setSample(data.sample||[]) }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">QSR Preset Wizard</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.keys(form).map(k=> (<div key={k} className={k==='apply'?'col-span-2':''}><label className="text-sm">{k}</label>
          {typeof form[k]==='boolean' ? (<label className="flex items-center gap-2"><input type="checkbox" checked={form[k]} onChange={e=>on(k, e.target.checked)} />Apply to scenario</label>)
          : (<input className="border rounded px-2 py-1 w-full" value={form[k]} onChange={e=>on(k, e.target.value)} />)}</div>))}
      </div>
      <button onClick={run} className="px-3 py-2 rounded bg-slate-900 text-white">Generate</button>
      {count>0 && <div className="text-sm">Created {count} rows. Sample:</div>}
      {sample.length>0 && <pre className="bg-slate-100 rounded p-2 text-xs overflow-auto">{JSON.stringify(sample,null,2)}</pre>}
    </div>
  )
}