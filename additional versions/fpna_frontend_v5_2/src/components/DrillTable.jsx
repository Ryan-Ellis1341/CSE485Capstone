import React from 'react'
export default function DrillTable({rows}){
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-3 py-2">Month</th>
            <th className="px-3 py-2">Dept</th>
            <th className="px-3 py-2">Account</th>
            <th className="px-3 py-2 text-right">Actual</th>
            <th className="px-3 py-2 text-right">Budget</th>
            <th className="px-3 py-2 text-right">Variance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=> (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{r.month}</td>
              <td className="px-3 py-2">{r.dept}</td>
              <td className="px-3 py-2">{r.account_std}</td>
              <td className="px-3 py-2 text-right">{r.amount_func?.toLocaleString?.() || r.amount_func || r.actual}</td>
              <td className="px-3 py-2 text-right">{r.budget_func?.toLocaleString?.() || r.budget_func || r.budget}</td>
              <td className="px-3 py-2 text-right">{((r.amount_func ?? r.actual ?? 0)-(r.budget_func ?? r.budget ?? 0)).toLocaleString?.() || ((r.amount_func ?? r.actual ?? 0)-(r.budget_func ?? r.budget ?? 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}