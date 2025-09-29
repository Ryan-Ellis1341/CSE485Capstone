import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Versions({api, token}){
  const [scenario,setScenario]=useState('2027:Base'); const [name,setName]=useState('Checkpoint-1'); const [versions,setVersions]=useState([]); const [msg,setMsg]=useState('')
  async function save(){ try{ const client=makeClient(api, token); await client.post('/versions/save',{scenario,name}); list() }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  async function list(){ try{ const client=makeClient(api, token); const {data}=await client.get('/versions/list',{params:{scenario}}); setVersions(data.versions||[]) }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  async function restore(n){ try{ const client=makeClient(api, token); await client.post('/versions/restore',{scenario,name:n}); setMsg('Restored '+n) }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Versions</h2>
    <div className="flex items-end gap-3 mt-2">
      <div><label className="text-xs text-slate-500">Scenario</label><input className="border rounded px-2 py-1 w-44" value={scenario} onChange={e=>setScenario(e.target.value)}/></div>
      <div><label className="text-xs text-slate-500">Name</label><input className="border rounded px-2 py-1 w-44" value={name} onChange={e=>setName(e.target.value)}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={save}>Save</button>
      <button className="px-3 py-1 rounded border" onClick={list}>List</button>
    </div>
    <ul className="mt-3 space-y-2">{versions.map(v=> <li key={v}><button className="px-2 py-1 rounded border mr-2" onClick={()=>restore(v)}>Restore</button>{v}</li>)}</ul>
    {msg && <div className="mt-2 p-2 rounded bg-slate-50 border text-sm">{msg}</div>}
    <div className="mt-2 text-sm text-slate-500">Note: endpoints in the single-file backend (app_super_v3).</div>
  </div>) }