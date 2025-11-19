import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'
import KPIStat from '../components/KPIStat.jsx'
import { TrendChart, Waterfall } from '../components/ChartCard.jsx'

export default function Dashboard({api, token, year, scenario}){
  const [kpis, setKpis] = useState({rev:0, cogs:0, ebitda:0})
  const [trend, setTrend] = useState([])
  const [wf, setWf] = useState([])

  useEffect(()=>{
    ;(async()=>{
      try{
        const client = makeClient(api, token)
        const { data } = await client.post('/bva/analyze', { year, scenario })
        const rows = data.hotspots || []
        const byMonth = {}
        rows.forEach(r => {
          if(!byMonth[r.month]) byMonth[r.month] = {month:r.month, actual:0, budget:0}
          byMonth[r.month].actual += r.amount_func||0
          byMonth[r.month].budget += r.budget_func||0
        })
        const trendData = Object.values(byMonth).sort((a,b)=>a.month.localeCompare(b.month))
          .map(r => ({ month:r.month, value:(r.actual||0) - (r.budget||0) }))
        setTrend(trendData)
        const rev = rows.filter(r=>r.account_std.startsWith('Revenue')).reduce((a,b)=>a+(b.amount_func||0),0)
        const cogs = rows.filter(r=>r.account_std.startsWith('COGS')).reduce((a,b)=>a+(b.amount_func||0),0)
        const opex = rows.filter(r=>r.account_std.startsWith('Opex')).reduce((a,b)=>a+(b.amount_func||0),0)
        setKpis({rev, cogs, ebitda: rev-cogs-opex})
        setWf([
          {label:'Revenue', value:rev},
          {label:'COGS', value:-cogs},
          {label:'Opex', value:-opex},
          {label:'EBITDA', value:rev-cogs-opex}
        ])
      }catch(e){ console.error(e) }
    })()
  }, [api, token, year, scenario])

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPIStat label="Revenue (Act)" value={"$"+kpis.rev.toLocaleString()} />
        <KPIStat label="COGS (Act)" value={"$"+kpis.cogs.toLocaleString()} />
        <KPIStat label="EBITDA (Act)" value={"$"+kpis.ebitda.toLocaleString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart data={trend} x="month" y="value" title="Variance Trend (Act - Budget)" />
        <Waterfall data={wf} x="label" y="value" title="EBITDA Walk" />
      </div>
    </div>
  )
}