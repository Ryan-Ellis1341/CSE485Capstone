import React, { useState } from 'react'
import { makeClient } from '../api'
export default function ExcelIO({api, token}){
  const [year,setYear]=useState(2027); const [scenario,setScenario]=useState('2027:Base')
  const [accounts,setAccounts]=useState('["Revenue:*","COGS:*","Opex:*"]'); const [rows,setRows]=useState([]); const [msg,setMsg]=useState('')
  async function retrieve(){ try{ const client=makeClient(api, token); const {data}=await client.post('/excel/retrieve',{year,scenario,accounts:JSON.parse(accounts)}); setRows(data) }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  async function submit(){ try{ const client=makeClient(api, token); const {data}=await client.post('/excel/submit',{scenario,rows}); setMsg(JSON.stringify(data)) }catch(e){ setMsg(String(e.response?.data||e.message)) } }
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Excel I/O</h2>
    <div className="flex items-end gap-3 mt-2">
      <div><label className="text-xs text-slate-500">Year</label><input className="border rounded px-2 py-1 w-24" type="number" value={year} onChange={e=>setYear(Number(e.target.value))}/></div>
      <div><label className="text-xs text-slate-500">Scenario</label><input className="border rounded px-2 py-1 w-44" value={scenario} onChange={e=>setScenario(e.target.value)}/></div>
      <div className="flex-1"><label className="text-xs text-slate-500">Accounts (JSON)</label><input className="border rounded px-2 py-1 w-full" value={accounts} onChange={e=>setAccounts(e.target.value)}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={retrieve}>Retrieve</button>
    </div>
    <div className="mt-3">
      <label className="text-xs text-slate-500">Rows JSON</label>
      <textarea className="border rounded w-full h-64 p-2" value={JSON.stringify(rows,null,2)} onChange={e=>setRows(JSON.parse(e.target.value))}/>
    </div>
    <button className="px-3 py-1 rounded bg-slate-900 text-white mt-2" onClick={submit}>Submit</button>
    {msg && <div className="mt-2 p-2 rounded bg-slate-50 border text-sm">{msg}</div>}
    <div className="mt-2 text-sm text-slate-500">Note: endpoints in the single-file backend (app_super_v3).</div>
  </div>) }