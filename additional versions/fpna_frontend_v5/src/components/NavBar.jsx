import React from 'react'
const items = ['Login','Dashboard','BvA','Forecast','Scenarios','Headcount','Assets','FX','Migrate','BoardPack']
export default function NavBar({onNavigate, active}){
  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center gap-2 p-2 overflow-x-auto">
        <div className="font-semibold mr-2">FP&A v5</div>
        {items.map(i => (
          <button key={i} onClick={()=>onNavigate(i)} className={`px-3 py-1 rounded-full text-sm ${active===i?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>{i}</button>
        ))}
      </div>
    </div>
  )
}