import React from 'react'
export default function SettingsBar({api,setApi,token,setToken}){
  return (
    <div className="max-w-6xl mx-auto px-4 mt-4">
      <div className="bg-white border rounded-xl p-4 flex gap-4 items-end">
        <div><label className="text-xs text-slate-500">API Base URL</label><input className="border rounded px-2 py-1 w-80" value={api} onChange={e=>setApi(e.target.value)}/></div>
        <div><label className="text-xs text-slate-500">Bearer Token</label><input className="border rounded px-2 py-1 w-64" value={token} onChange={e=>setToken(e.target.value)} placeholder="admin-token / analyst-token / viewer-token"/></div>
      </div>
    </div>
  )
}