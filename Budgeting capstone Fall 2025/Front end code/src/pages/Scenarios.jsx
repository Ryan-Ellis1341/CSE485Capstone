import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Scenarios({api, token}){
  const [base,setBase]=useState('2027:Base'); const [to,setTo]=useState('2027:Best'); const [pct,setPct]=useState(0.03); const [msg,setMsg]=useState('')
  const [sens,setSens]=useState({scenario:'2027:Base',account_pattern:'COGS:*',pct:0.1})
  async function clone(){ try{ const client=makeClient(api, token); await client.post('/scenario/clone',{base,to,pct}); setMsg('Cloned.') }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  async function applySens(){ try{ const client=makeClient(api, token); const {data}=await client.post('/scenario/sensitivity',sens); setMsg('Updated rows: '+data.updated_rows) }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Scenarios</h2>
    <div className="flex items-end gap-3 mt-2">
      <div><label className="text-xs text-slate-500">Base</label><input className="border rounded px-2 py-1 w-44" value={base} onChange={e=>setBase(e.target.value)}/></div>
      <div><label className="text-xs text-slate-500">To</label><input className="border rounded px-2 py-1 w-44" value={to} onChange={e=>setTo(e.target.value)}/></div>
      <div><label className="text-xs text-slate-500">Uplift %</label><input className="border rounded px-2 py-1 w-24" type="number" step="0.01" value={pct} onChange={e=>setPct(Number(e.target.value))}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={clone}>Clone</button>
    </div>
    <h3 className="font-medium mt-4">Sensitivity</h3>
    <div className="flex items-end gap-3 mt-2">
      <div><label className="text-xs text-slate-500">Scenario</label><input className="border rounded px-2 py-1 w-44" value={sens.scenario} onChange={e=>setSens({...sens,scenario:e.target.value})}/></div>
      <div><label className="text-xs text-slate-500">Account Pattern</label><input className="border rounded px-2 py-1 w-44" value={sens.account_pattern} onChange={e=>setSens({...sens,account_pattern:e.target.value})}/></div>
      <div><label className="text-xs text-slate-500">Percent</label><input className="border rounded px-2 py-1 w-24" type="number" step="0.01" value={sens.pct} onChange={e=>setSens({...sens,pct:Number(e.target.value)})}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={applySens}>Apply</button>
    </div>
    {msg && <div className="mt-2 p-2 rounded bg-yellow-50 border text-sm">{msg}</div>}
    <div className="mt-2 text-sm text-slate-500">Note: endpoints in the single-file backend (app_super_v3).</div>
  </div>) }