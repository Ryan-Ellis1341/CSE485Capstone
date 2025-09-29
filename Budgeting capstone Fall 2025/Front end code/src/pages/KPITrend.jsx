import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
function aggMonthly(rows){
  const by = {}
  for(const r of rows){
    const m = r.month, a = r.account_std || '', amt = Number(r.amount || 0)
    if(!by[m]) by[m] = { month:m, revenue:0, cogs:0, opex:0 }
    if(a.startsWith('Revenue')) by[m].revenue += amt
    else if(a.startsWith('COGS')) by[m].cogs += amt
    else if(a.startsWith('Opex') && a!=='Opex:Depreciation') by[m].opex += amt
  }
  return Object.values(by).sort((a,b)=>a.month.localeCompare(b.month)).map(row => {
    const ebitda = row.revenue - row.cogs - row.opex
    const gm = row.revenue>0 ? (row.revenue-row.cogs)/row.revenue*100 : 0
    return {...row, ebitda, gm}
  })
}
export default function KPITrend({api, token}){
  const [year, setYear] = useState(2027)
  const [scenario, setScenario] = useState('2027:Base')
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  async function load(){
    setErr('')
    try{
      const client = makeClient(api, token)
      const { data } = await client.post('/excel/retrieve', { year, scenario, accounts:["Revenue:*","COGS:*","Opex:*"] })
      setRows(aggMonthly(data))
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="h-72 border rounded-lg p-2">
        <div className="text-sm text-slate-600 mb-1">Revenue / COGS / EBITDA</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/>
            <Line type="monotone" dataKey="revenue" name="Revenue"/>
            <Line type="monotone" dataKey="cogs" name="COGS"/>
            <Line type="monotone" dataKey="ebitda" name="EBITDA"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72 border rounded-lg p-2">
        <div className="text-sm text-slate-600 mb-1">Gross Margin %</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/>
            <Line type="monotone" dataKey="gm" name="GM %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>) }