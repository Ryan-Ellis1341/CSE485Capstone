import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Migrate({api, token, year, scenario}){
  const [file, setFile] = useState(null)
  const [system, setSystem] = useState('quickbooks')
  const [dry, setDry] = useState(true)
  const [result, setResult] = useState(null)
  async function upload(){
    if(!file) return alert('Choose CSV first')
    const form = new FormData(); form.append('file', file); form.append('scenario', scenario); form.append('fiscal_year', year); form.append('dry_run', dry ? 'true' : 'false')
    const client = makeClient(api, token); const url = system==='quickbooks'? '/migrate/quickbooks/csv' : '/migrate/netsuite/csv'
    const { data } = await client.post(url, form); setResult(data)
  }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">Migration Wizard (CSV)</div>
      <div className="flex flex-wrap gap-3 items-end">
        <div><label className="text-sm">System</label><select className="border rounded px-2 py-1" value={system} onChange={e=>setSystem(e.target.value)}><option value="quickbooks">QuickBooks</option><option value="netsuite">NetSuite</option></select></div>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={dry} onChange={e=>setDry(e.target.checked)} />Dry Run</label>
        <button onClick={upload} className="px-3 py-2 rounded bg-slate-900 text-white">Upload & Map</button>
      </div>
      {result && (<div className="text-sm"><div>Rows parsed: {result.rows}</div><pre className="bg-slate-100 rounded p-2 mt-2 overflow-auto">{JSON.stringify(result.sample, null, 2)}</pre></div>)}
    </div>
  )
}