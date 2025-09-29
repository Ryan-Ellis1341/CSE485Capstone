import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
export default function Dashboard({api, token}){
  const [year, setYear] = useState(2024)
  const [scenario, setScenario] = useState('2027:Base')
  const [summary, setSummary] = useState('')
  const [hotspots, setHotspots] = useState([])
  const [err, setErr] = useState('')
  async function load(){
    setErr('')
    try{
      const client = makeClient(api, token)
      const { data } = await client.post('/bva/analyze', { year, scenario })
      setSummary(data.summary || '')
      setHotspots(data.hotspots || [])
    }catch(e){ setErr(String(e.response?.data || e.message)) }
  }
  useEffect(()=>{ load() }, [])
  return (<div className="bg-white border rounded-xl p-4">
    <div className="flex items-end gap-3">
      <div><label className="text-xs text-slate-500">Year</label><input className="border rounded px-2 py-1 w-24" type="number" value={year} onChange={e=>setYear(Number(e.target.value))}/></div>
      <div><label className="text-xs text-slate-500">Scenario</label><input className="border rounded px-2 py-1 w-44" value={scenario} onChange={e=>setScenario(e.target.value)}/></div>
      <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={load}>Refresh</button>
    </div>
    {err && <div className="mt-3 p-2 rounded bg-yellow-50 border text-sm">{err}</div>}
    {summary && <div className="mt-4 p-3 rounded bg-slate-50 border"><b>AI Summary:</b> {summary}</div>}
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hotspots}>
          <XAxis dataKey="account_std"/><YAxis/><Tooltip/><Legend/>
          <Bar dataKey="amount_func" name="Actual (func)" />
          <Bar dataKey="budget_func" name="Budget (func)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>) }