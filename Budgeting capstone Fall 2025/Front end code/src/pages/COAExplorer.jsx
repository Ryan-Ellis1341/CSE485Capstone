import React from 'react'
const tree = { Revenue: ['Revenue:Food','Revenue:Beverage'], COGS: ['COGS:Food','COGS:Paper'], Opex: ['Opex:Labor','Opex:PayrollTaxes','Opex:Benefits','Opex:Rent','Opex:Utilities','Opex:Royalty','Opex:AdFund','Opex:R&M','Opex:Supplies','Opex:Insurance','Opex:Depreciation'] }
export default function COAExplorer(){
  return (<div className="bg-white border rounded-xl p-4">
    <h2 className="text-lg font-semibold">Chart of Accounts (Standard)</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
      {Object.entries(tree).map(([grp, accts]) => (
        <div key={grp} className="border rounded-lg p-3">
          <div className="font-medium mb-2">{grp}</div>
          <ul className="text-sm space-y-1">{accts.map(a => <li key={a} className="px-2 py-1 rounded bg-slate-50 border">{a}</li>)}</ul>
        </div>
      ))}
    </div>
    <p className="text-sm text-slate-500 mt-3">Tip: Map vendor accounts to these standard names during migration.</p>
  </div>) }