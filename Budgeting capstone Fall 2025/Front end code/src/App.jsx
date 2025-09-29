import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import SettingsBar from './components/SettingsBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import KPITrend from './pages/KPITrend.jsx'
import COAExplorer from './pages/COAExplorer.jsx'
import DeptTree from './pages/DeptTree.jsx'
import Headcount from './pages/Headcount.jsx'
import Solver from './pages/Solver.jsx'
import Scenarios from './pages/Scenarios.jsx'
import Versions from './pages/Versions.jsx'
import ExcelIO from './pages/ExcelIO.jsx'
import Migrations from './pages/Migrations.jsx'

export default function App(){
  const [api, setApi] = useState('http://127.0.0.1:8000')
  const [token, setToken] = useState('analyst-token')
  return (
    <div className="min-h-screen">
      <NavBar/>
      <SettingsBar api={api} setApi={setApi} token={token} setToken={setToken}/>
      <div className="max-w-6xl mx-auto px-4 mt-4 space-y-4">
        <Routes>
          <Route path="/" element={<Dashboard api={api} token={token}/>}/>
          <Route path="/kpi" element={<KPITrend api={api} token={token}/>}/>
          <Route path="/coa" element={<COAExplorer/>}/>
          <Route path="/dept" element={<DeptTree/>}/>
          <Route path="/headcount" element={<Headcount api={api} token={token}/>}/>
          <Route path="/solver" element={<Solver api={api} token={token}/>}/>
          <Route path="/scenarios" element={<Scenarios api={api} token={token}/>}/>
          <Route path="/versions" element={<Versions api={api} token={token}/>}/>
          <Route path="/excel" element={<ExcelIO api={api} token={token}/>}/>
          <Route path="/migrate" element={<Migrations api={api} token={token}/>}/>
        </Routes>
      </div>
    </div>
  )
}