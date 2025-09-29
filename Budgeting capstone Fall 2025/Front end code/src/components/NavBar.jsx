import React from 'react'
import { Link, useLocation } from 'react-router-dom'
export default function NavBar(){
  const loc = useLocation()
  const tabs = [['/','Dashboard'],['/kpi','KPI Trend'],['/coa','COA Explorer'],['/dept','Departments'],['/headcount','Headcount'],['/solver','Solver'],['/scenarios','Scenarios'],['/versions','Versions'],['/excel','Excel I/O'],['/migrate','Migrations']]
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 flex-wrap">
        {tabs.map(([to,label]) => (
          <Link key={to} to={to} className={`text-sm px-3 py-1 rounded ${loc.pathname===to?'bg-slate-900 text-white':'text-slate-700 hover:bg-slate-100'}`}>{label}</Link>
        ))}
      </div>
    </nav>
  )
}