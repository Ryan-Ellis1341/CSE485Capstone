import React, { useEffect, useMemo, useState } from 'react'
import { makeClient } from '../api'
import DrillTable from '../components/DrillTable.jsx'
import { Waterfall } from '../components/ChartCard.jsx'

export default function BvA({api, token, year, scenario}){
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState('')
  const [llm, setLLM] = useState('')
  const top10 = useMemo(()=>{
    return [...rows].sort((a,b)=>Math.abs((b.amount_func??b.actual??0)-(b.budget_func??b.budget??0)) - Math.abs((a.amount_func??a.actual??0)-(a.budget_func??a.budget??0))).slice(0,10)
      .map(r => ({ label: `${r.account_std.split(':').pop()} (${r.month})`, value: (r.amount_func ?? r.actual ?? 0) - (r.budget_func ?? r.budget ?? 0) }))
  }, [rows])

  useEffect(()=>{
    ;(async()=>{
      try{
        const client = makeClient(api, token)
        const { data } = await client.post('/bva/analyze', { year, scenario })
        setRows(data.hotspots || []); setSummary(data.summary || ''); setLLM(data.llm_summary || '')
      }catch(e){ console.error(e) }
    })()
  }, [api, token, year, scenario])

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="font-medium">AI Summary</div>
        <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{summary}</div>
        {llm && <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap"><strong>LLM:</strong> {llm}</div>}
      </div>
      <Waterfall data={top10} x="label" y="value" title="Top 10 Variance Waterfall" />
      <DrillTable rows={rows} />
    </div>
  )
}