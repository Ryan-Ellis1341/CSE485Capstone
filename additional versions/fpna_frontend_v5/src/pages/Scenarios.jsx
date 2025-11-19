import React, { useState } from 'react'
import { makeClient } from '../api'

export default function Scenarios({api, token, scenario, setScenario}){
  const [to, setTo] = useState(scenario + ':Copy')
  const [pct, setPct] = useState(0)
  const [sensAcct, setSensAcct] = useState('COGS:%')
  const [sensPct, setSensPct] = useState(0.05)

  async function clone(){
    const client = makeClient(api, token)
    await client.post('/scenario/clone', { base: scenario, to, pct: parseFloat(pct||0) })
    setScenario(to)
    alert('Cloned to ' + to)
  }
  async function sensitivity(){
    const client = makeClient(api, token)
    const { data } = await client.post('/scenario/sensitivity', { scenario, account_pattern: sensAcct, pct: parseFloat(sensPct||0) })
    alert('Updated rows: ' + data.updated_rows)
  }

  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-sm">Clone to</label>
          <input className="border rounded px-2 py-1 block" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Uplift % (e.g., 0.03)</label>
          <input className="border rounded px-2 py-1 block" value={pct} onChange={e=>setPct(e.target.value)} />
        </div>
        <button onClick={clone} className="px-3 py-2 rounded bg-slate-900 text-white">Clone Scenario</button>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-sm">Account Pattern</label>
          <input className="border rounded px-2 py-1 block" value={sensAcct} onChange={e=>setSensAcct(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Percent (e.g., 0.05)</label>
          <input className="border rounded px-2 py-1 block" value={sensPct} onChange={e=>setSensPct(e.target.value)} />
        </div>
        <button onClick={sensitivity} className="px-3 py-2 rounded bg-slate-900 text-white">Apply Sensitivity</button>
      </div>
    </div>
  )
}