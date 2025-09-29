import React, { useEffect, useMemo, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Wizard from './components/Wizard.jsx'
import Scenarios from './components/Scenarios.jsx'
import QuickBooks from './components/QuickBooks.jsx'
import AuthBar from './components/AuthBar.jsx'

const API_DEFAULT = 'http://127.0.0.1:8000'

export default function App(){
  const [view, setView] = useState('dashboard')
  const [year, setYear] = useState(2025)
  const [scenario, setScenario] = useState('2025:Base')
  const [token, setToken] = useState('viewer-token')   // default to viewer for safety
  const [role, setRole] = useState('Viewer')
  const [API, setAPI] = useState(API_DEFAULT)

  function withAuth(init){
    return { ...(init||{}), headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + token, ...(init?.headers||{})} }
  }

  return (
    <div style={{fontFamily:'Inter,system-ui,arial', padding:'16px', maxWidth:1200, margin:'0 auto'}}>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h2>AI-First Budgeting</h2>
        <nav style={{display:'flex',gap:8}}>
          <button onClick={()=>setView('dashboard')}>Dashboard</button>
          <button onClick={()=>setView('wizard')}>Setup Wizard</button>
          <button onClick={()=>setView('scenarios')}>Scenarios</button>
          <button onClick={()=>setView('qb')}>QuickBooks</button>
        </nav>
      </header>
      <AuthBar API={API} setAPI={setAPI} role={role} setRole={setRole} token={token} setToken={setToken} />
      <hr/>
      {view==='wizard' && <Wizard API={API} auth={withAuth} role={role} onDone={(yr)=>{setYear(yr); setScenario(`${yr}:Base`); setView('dashboard')}} />}
      {view==='dashboard' && <Dashboard API={API} auth={withAuth} year={year} scenario={scenario} />}
      {view==='scenarios' && <Scenarios API={API} auth={withAuth} year={year} scenario={scenario} setScenario={setScenario} role={role} />}
      {view==='qb' && <QuickBooks API={API} auth={withAuth} role={role} />}
      <footer style={{marginTop:24,opacity:0.7}}>
        <small>Backend API: {API} • Role: {role}</small>
      </footer>
    </div>
  )
}
