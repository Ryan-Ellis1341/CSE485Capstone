import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'
import DrillTable from '../components/DrillTable.jsx'

export default function BvA({api, token, year, scenario}){
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState('')
  const [llm, setLLM] = useState('')

  useEffect(()=>{
    ;(async()=>{
      try{
        const client = makeClient(api, token)
        const { data } = await client.post('/bva/analyze', { year, scenario })
        setRows(data.hotspots || [])
        setSummary(data.summary || '')
        setLLM(data.llm_summary || '')
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
      <DrillTable rows={rows} />
    </div>
  )
}