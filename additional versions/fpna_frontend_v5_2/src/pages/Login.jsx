import React, { useState } from 'react'
import { makeClient } from '../api'
export default function Login({api,setApi,setToken,setPage}){
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [testApi, setTestApi] = useState(api)
  async function doLogin(){
    try{ const client = makeClient(testApi); const { data } = await client.post('/auth/login', { email, password }); setApi(testApi); setToken(data.token); setPage('SetupWizard') }
    catch(e){ alert('Login failed: ' + (e?.response?.data?.detail || e.message)) }
  }
  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6 space-y-3">
      <div className="text-lg font-semibold">Connect Backend & Login</div>
      <label className="text-sm">API Base URL</label>
      <input className="border rounded px-3 py-2 w-full" value={testApi} onChange={e=>setTestApi(e.target.value)} />
      <label className="text-sm">Email</label>
      <input className="border rounded px-3 py-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} />
      <label className="text-sm">Password</label>
      <input className="border rounded px-3 py-2 w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={doLogin} className="w-full py-2 bg-slate-900 text-white rounded">Login</button>
      <div className="text-xs text-slate-500">Try admin/analyst/viewer users seeded in backend.</div>
    </div>
  )
}