import React, { useState } from 'react'
import NavBar from './components/NavBar.jsx'
import SettingsBar from './components/SettingsBar.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BvA from './pages/BvA.jsx'
import Forecast from './pages/Forecast.jsx'
import Scenarios from './pages/Scenarios.jsx'
import Headcount from './pages/Headcount.jsx'
import Assets from './pages/Assets.jsx'
import FX from './pages/FX.jsx'
import Migrate from './pages/Migrate.jsx'
import BoardPack from './pages/BoardPack.jsx'
import Login from './pages/Login.jsx'

export default function App(){
  const [api, setApi] = useState('http://127.0.0.1:8000')
  const [token, setToken] = useState('')
  const [page, setPage] = useState('Login')
  const [scenario, setScenario] = useState('2027:Base')
  const [year, setYear] = useState(2027)

  const pages = {
    'Dashboard': <Dashboard api={api} token={token} year={year} scenario={scenario}/>,
    'BvA': <BvA api={api} token={token} year={year} scenario={scenario}/>,
    'Forecast': <Forecast api={api} token={token} scenario={scenario}/>,
    'Scenarios': <Scenarios api={api} token={token} scenario={scenario} setScenario={setScenario}/>,
    'Headcount': <Headcount api={api} token={token} year={year} scenario={scenario}/>,
    'Assets': <Assets api={api} token={token} year={year} scenario={scenario}/>,
    'FX': <FX api={api} token={token}/>,
    'Migrate': <Migrate api={api} token={token} year={year} scenario={scenario}/>,
    'BoardPack': <BoardPack api={api} token={token} year={year} scenario={scenario}/>,
    'Login': <Login api={api} setApi={setApi} setToken={setToken} setPage={setPage}/>
  }

  return (
    <div className="min-h-screen text-slate-900">
      <NavBar onNavigate={setPage} active={page} />
      <SettingsBar api={api} setApi={setApi} scenario={scenario} setScenario={setScenario} year={year} setYear={setYear} />
      <div className="max-w-7xl mx-auto p-4">{pages[page]}</div>
      <ChatWidget api={api} token={token} userId="student1" threadId="global" />
    </div>
  )
}