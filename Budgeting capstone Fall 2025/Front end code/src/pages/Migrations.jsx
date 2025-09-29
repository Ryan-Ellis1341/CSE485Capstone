import React, { useState } from 'react'
export default function Migrations({api, token}){
  const [system,setSystem]=useState('datarails'); const [file,setFile]=useState(null)
  const [options,setOptions]=useState(JSON.stringify({to:'budget',scenario:'2027:Imported',dry_run:true},null,2))
  const [report,setReport]=useState(null); const [busy,setBusy]=useState(false)
  async function upload(dryRun=true){
    if(!file){ alert('Choose a CSV file'); return }
    setBusy(true); setReport(null)
    try{
      const form=new FormData(); form.append('file',file)
      const opts={...JSON.parse(options), dry_run: dryRun}; form.append('options', JSON.stringify(opts))
      const resp=await fetch(`${api}/migrate/${system}/csv`, { method:'POST', body: form, headers:{ 'Authorization': `Bearer ${token}` }})
      setReport(await resp.json())
    }catch(e){ setReport({error:String(e)}) }finally{ setBusy(false) }
  }
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Migrations</h2>
    <div className="flex items-end gap-3 mt-2">
      <div><label className="text-xs text-slate-500">System</label>
        <select className="border rounded px-2 py-1" value={system} onChange={e=>setSystem(e.target.value)}>
          <option value="datarails">DataRails</option><option value="netsuite">NetSuite</option><option value="hyperion">Hyperion</option>
        </select>
      </div>
      <div><label className="text-xs text-slate-500">CSV File</label><input className="border rounded px-2 py-1" type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" disabled={busy} onClick={()=>upload(true)}>Dry Run</button>
      <button className="px-3 py-1 rounded border" disabled={busy} onClick={()=>upload(false)}>Import</button>
    </div>
    <div className="mt-3"><label className="text-xs text-slate-500">Options (JSON)</label><textarea className="border rounded w-full h-40 p-2" value={options} onChange={e=>setOptions(e.target.value)}/></div>
    {report && <div className="mt-3 border rounded p-3 bg-slate-50"><pre className="text-sm">{JSON.stringify(report,null,2)}</pre></div>}
    <div className="mt-2 text-sm text-slate-500">Note: endpoints in the v3.1 backend.</div>
  </div>) }