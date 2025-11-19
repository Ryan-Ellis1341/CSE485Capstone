import React, { useState } from 'react'
import { makeClient } from '../api'
import { TrendChart } from '../components/ChartCard.jsx'
export default function Forecast({api, token, scenario}){
  const [model, setModel] = useState('ensemble')
  const [preds, setPreds] = useState([])
  async function run(){
    try{ const client = makeClient(api, token); const { data } = await client.post('/forecast/run', { scenario, account_pattern:'Revenue:%', periods:12, model }); const series = data.predictions.map((v,i)=>({month:`F+${i+1}`, value:v})); setPreds(series) }
    catch(e){ alert('Run failed: '+(e?.response?.data?.detail || e.message)) }
  }
  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-2xl shadow p-4 flex gap-3 items-end">
        <div><label className="text-sm">Model</label>
          <select className="border rounded px-2 py-1 block" value={model} onChange={e=>setModel(e.target.value)}>
            <option value="trend">Trend</option><option value="ma">Moving Average</option><option value="ensemble">Ensemble</option>
          </select>
        </div>
        <button onClick={run} className="px-3 py-2 rounded bg-slate-900 text-white">Run Forecast</button>
      </div>
      <TrendChart data={preds} x="month" y="value" title="Forecast (Revenue)" />
    </div>
  )
}