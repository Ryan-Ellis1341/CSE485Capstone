import React from 'react'
export default function KPIStat({label, value, delta}){
  const pos = (delta||0) >= 0
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {delta!=null && <div className={`text-sm ${pos?'text-emerald-600':'text-rose-600'}`}>{pos?'+':''}{delta}%</div>}
    </div>
  )
}