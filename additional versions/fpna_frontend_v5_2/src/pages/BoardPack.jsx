import React, { useState } from 'react'
import { makeClient } from '../api'
export default function BoardPack({api, token, year, scenario}){
  const [path, setPath] = useState('')
  async function generate(){ const client = makeClient(api, token); const { data } = await client.post('/boardpack/generate', { year, scenario }); setPath(data.file) }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">Board Pack</div>
      <button onClick={generate} className="px-3 py-2 rounded bg-slate-900 text-white">Generate PPTX</button>
      {path && <div className="text-sm">Server created: <code>{path}</code></div>}
    </div>
  )
}