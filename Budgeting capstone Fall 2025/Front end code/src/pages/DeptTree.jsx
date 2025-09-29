import React from 'react'
export default function DeptTree(){
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Department Hierarchy</h2>
    <div className="mt-2">
      <div className="font-medium">HQ</div>
      <div className="ml-4 mt-1">
        <div className="px-2 py-1 rounded bg-slate-50 border inline-block mr-2">Sales</div>
        <div className="px-2 py-1 rounded bg-slate-50 border inline-block">Ops</div>
      </div>
    </div>
    <p className="text-sm text-slate-500 mt-3">Use this hierarchy for filtering and roll-ups in reports.</p>
  </div>) }