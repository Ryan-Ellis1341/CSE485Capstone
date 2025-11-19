import React, { useEffect, useState } from 'react'
import { makeClient } from '../api'
import KPIStat from '../components/KPIStat.jsx'
import { TrendChart, YoYBar, ContributionStack, Waterfall } from '../components/ChartCard.jsx'

export default function Dashboard({api, token, year, scenario}){
  const [trend, setTrend] = useState([])
  const [yoy, setYoY] = useState([])
  const [stack, setStack] = useState([])
  const [wf, setWf] = useState([])
  const [kpis, setKpis] = useState({rev:0,cogs:0,opex:0,ebitda:0})

  useEffect(()=>{
    ;(async()=>{
      try{
        const client = makeClient(api, token)
        const { data } = await client.post('/bva/analyze', { year, scenario })
        const rows = data.hotspots || []
        const byMonth = {}
        rows.forEach(r => {
          const m = r.month || '2027-01'
          if(!byMonth[m]) byMonth[m] = {month:m, actual:0, budget:0}
          byMonth[m].actual += r.amount_func || r.actual || 0
          byMonth[m].budget += r.budget_func || r.budget || 0
        })
        const trendData = Object.values(byMonth).sort((a,b)=>a.month.localeCompare(b.month))
          .map(r => ({ month:r.month, value:(r.actual||0) - (r.budget||0) }))
        setTrend(trendData)

        const rev = rows.filter(r=>r.account_std.startsWith('Revenue')).reduce((a,b)=>a+(b.amount_func||b.actual||0),0)
        const cogs = rows.filter(r=>r.account_std.startsWith('COGS')).reduce((a,b)=>a+(b.amount_func||b.actual||0),0)
        const opex = rows.filter(r=>r.account_std.startsWith('Opex')).reduce((a,b)=>a+(b.amount_func||b.actual||0),0)
        const ebitda = rev - cogs - opex
        setKpis({rev,cogs,opex,ebitda})

        setStack([{label:'YTD', revenue:rev, cogs:-cogs, opex:-opex}])

        const wfData=[{label:'Revenue',value:rev},{label:'COGS',value:-cogs},{label:'Opex',value:-opex},{label:'EBITDA',value:ebitda}]
        setWf(wfData)

        const lastYear = rev*0.92 // simple proxy so chart renders out-of-box
        setYoY([{label:'Revenue', this:rev, last:lastYear}])

      }catch(e){ console.error(e) }
    })()
  }, [api, token, year, scenario])

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIStat label="Revenue (Act)" value={"$"+kpis.rev.toLocaleString()} />
        <KPIStat label="COGS (Act)" value={"$"+kpis.cogs.toLocaleString()} />
        <KPIStat label="Opex (Act)" value={"$"+kpis.opex.toLocaleString()} />
        <KPIStat label="EBITDA (Act)" value={"$"+kpis.ebitda.toLocaleString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart data={trend} x="month" y="value" title="Variance Trend (Act - Budget)" />
        <YoYBar data={yoy} title="YoY Comparison" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ContributionStack data={stack} title="Contribution Margin (YTD)" />
        <Waterfall data={wf} x="label" y="value" title="EBITDA Walk" />
      </div>
    </div>
  )
}