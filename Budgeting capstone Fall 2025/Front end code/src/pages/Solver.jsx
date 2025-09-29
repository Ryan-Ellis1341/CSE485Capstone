import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Solver({api, token}){
  const [scenario, setScenario] = useState('2027:Base'); const [target, setTarget] = useState(400000)
  const [range, setRange] = useState(0.2); const [apply, setApply] = useState(false); const [result,setResult]=useState(null); const [msg,setMsg]=useState('')
  async function run(){ try{ const client=makeClient(api, token); const {data}=await client.post('/solver/goal_seek',{scenario,target_ebitda:target,search_range:range,apply}); setResult(data) }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Goal Seek Solver</h2>
    <div className="flex items-end gap-3 mt-2">
      <div><label className="text-xs text-slate-500">Scenario</label><input className="border rounded px-2 py-1 w-44" value={scenario} onChange={e=>setScenario(e.target.value)}/></div>
      <div><label className="text-xs text-slate-500">Target EBITDA</label><input className="border rounded px-2 py-1 w-32" type="number" value={target} onChange={e=>setTarget(Number(e.target.value))}/></div>
      <div><label className="text-xs text-slate-500">Search Range (±)</label><input className="border rounded px-2 py-1 w-24" type="number" step="0.01" value={range} onChange={e=>setRange(Number(e.target.value))}/></div>
      <div><label className="text-xs text-slate-500">Apply</label><select className="border rounded px-2 py-1" value={String(apply)} onChange={e=>setApply(e.target.value==='true')}><option value="false">false</option><option value="true">true</option></select></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={run}>Run</button>
    </div>
    {msg && <div className="mt-2 p-2 rounded bg-yellow-50 border text-sm">{msg}</div>}
    {result && <div className="mt-3 border rounded p-3 bg-slate-50"><pre className="text-sm">{JSON.stringify(result,null,2)}</pre></div>}
    <div className="mt-2 text-sm text-slate-500">Note: endpoint in the single-file backend (app_super_v3).</div>
  </div>) }