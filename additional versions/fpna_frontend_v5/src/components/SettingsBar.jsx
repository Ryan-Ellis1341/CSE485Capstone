import React from 'react'

export default function SettingsBar({api,setApi,scenario,setScenario,year,setYear}){
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto flex gap-3 items-center p-2">
        <label className="text-sm">API</label>
        <input className="border rounded px-2 py-1 w-72" value={api} onChange={e=>setApi(e.target.value)}/>
        <label className="text-sm">Scenario</label>
        <input className="border rounded px-2 py-1 w-48" value={scenario} onChange={e=>setScenario(e.target.value)}/>
        <label className="text-sm">Year</label>
        <input className="border rounded px-2 py-1 w-24" value={year} onChange={e=>setYear(parseInt(e.target.value||'0'))}/>
      </div>
    </div>
  )
}