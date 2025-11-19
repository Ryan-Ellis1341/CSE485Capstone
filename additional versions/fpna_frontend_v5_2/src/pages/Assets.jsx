import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Assets({api, token, year, scenario}){
  const [asset, setAsset] = useState({name:'Oven', dept:'Ops', purchase_date:`${year}-02`, purchase_amount:12000, useful_life_months:60, salvage_value:0, currency:'USD'})
  async function add(){ const client = makeClient(api, token); await client.post('/assets/add', asset); alert('Asset added') }
  async function bake(){ const client = makeClient(api, token); const { data } = await client.post('/assets/depreciation/bake', { fiscal_year: year, scenario, apply: true }); alert('Depreciation rows: ' + data.rows) }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">Fixed Assets & Depreciation</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.keys(asset).map(k=> (<div key={k}><label className="text-sm">{k}</label><input className="border rounded px-2 py-1 w-full" value={asset[k]} onChange={e=>setAsset(prev=>({...prev, [k]: e.target.value}))}/></div>))}
      </div>
      <div className="flex gap-3"><button onClick={add} className="px-3 py-2 rounded bg-slate-900 text-white">Add Asset</button><button onClick={bake} className="px-3 py-2 rounded border">Bake Depreciation</button></div>
    </div>
  )
}