import React, { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts'

export default function Dashboard({API, auth, year=2025, scenario='2025:Base'}){
  const [summary, setSummary] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [forecast, setForecast] = useState([])

  async function load(){
    const r = await fetch(`${API}/bva/analyze`, auth({method:'POST', body: JSON.stringify({year, scenario})}))
    const js = await r.json(); setSummary(js.summary); setHotspots(js.hotspots||[])

    const f = await fetch(`${API}/forecast/ai`, auth({method:'POST', body: JSON.stringify({year, account:'Revenue:Food', model:'arima', months:12})}))
    const jf = await f.json(); setForecast(jf)
  }

  useEffect(()=>{ load() }, [API, year, scenario])

  return (
    <div>
      <h3>Executive Dashboard — {year} / {scenario}</h3>
      <p style={{background:'#f6f8fa', padding:12, borderRadius:8}}>{summary || 'Loading narrative...'}</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <VarianceWaterfall hotspots={hotspots} />
        <HotspotsTable rows={hotspots}/>
      </div>

      <h4>AI Forecast — Revenue:Food</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="forecast" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function HotspotsTable({rows}){
  return (
    <div>
      <h4>Hotspots</h4>
      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th>Account</th><th>Dept</th><th>Month</th><th>Actual</th><th>Budget</th><th>Δ</th><th>F/U</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{borderTop:'1px solid #eee'}}>
              <td>{r.account_std}</td>
              <td>{r.dept}</td>
              <td>{r.month}</td>
              <td>{fmt(r.amount_func)}</td>
              <td>{fmt(r.budget_func)}</td>
              <td style={{color:r.variance>=0?'green':'crimson'}}>{fmt(r.variance)}</td>
              <td>{r.FU}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function fmt(n){ return typeof n==='number' ? n.toLocaleString(undefined,{maximumFractionDigits:0}) : n }

function VarianceWaterfall({hotspots}){
  const data = hotspots.map(h=>({name: h.account_std, delta: h.variance}))
  return (
    <div>
      <h4>Variance Drivers</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="delta" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
