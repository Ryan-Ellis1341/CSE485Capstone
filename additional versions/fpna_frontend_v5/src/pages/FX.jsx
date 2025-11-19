import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'

export default function FX({api, token}){
  const [rate, setRate] = useState({as_of:'2027-01-01', from_ccy:'EUR', to_ccy:'USD', rate:1.1})
  const [rates, setRates] = useState([])

  async function submit(){
    const client = makeClient(api, token)
    await client.post('/fx/set', rate)
    load()
  }
  async function load(){
    const client = makeClient(api, token)
    const { data } = await client.get('/fx/list')
    setRates(data.rates||[])
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-2xl shadow p-4 flex gap-3 items-end">
        {['as_of','from_ccy','to_ccy','rate'].map(k=> (
          <div key={k}>
            <label className="text-sm">{k}</label>
            <input className="border rounded px-2 py-1 block" value={rate[k]} onChange={e=>setRate(prev=>({...prev,[k]:e.target.value}))}/>
          </div>
        ))}
        <button onClick={submit} className="px-3 py-2 rounded bg-slate-900 text-white">Set Rate</button>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="font-medium mb-2">Rates</div>
        <table className="min-w-full text-sm">
          <thead><tr><th className="text-left px-2 py-1">As Of</th><th className="text-left px-2 py-1">From</th><th className="text-left px-2 py-1">To</th><th className="text-right px-2 py-1">Rate</th></tr></thead>
          <tbody>
            {rates.map((r,i)=> (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{r.as_of}</td>
                <td className="px-2 py-1">{r.from_ccy}</td>
                <td className="px-2 py-1">{r.to_ccy}</td>
                <td className="px-2 py-1 text-right">{r.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}