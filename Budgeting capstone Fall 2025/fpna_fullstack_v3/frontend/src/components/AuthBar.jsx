import React from 'react'
export default function AuthBar({API, setAPI, role, setRole, token, setToken}){
  async function login(r){
    const resp = await fetch(`${API}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:'student', role:r})})
    const js = await resp.json()
    setToken(js.token); setRole(js.role)
  }
  return (
    <div style={{display:'flex', gap:12, alignItems:'center', marginTop:8}}>
      <label>API <input style={{width:280}} value={API} onChange={e=>setAPI(e.target.value)} /></label>
      <label>Token <input style={{width:220}} value={token} onChange={e=>setToken(e.target.value)} /></label>
      <span>Login as:</span>
      <button onClick={()=>login('Viewer')}>Viewer</button>
      <button onClick={()=>login('Analyst')}>Analyst</button>
      <button onClick={()=>login('Admin')}>Admin</button>
    </div>
  )
}
