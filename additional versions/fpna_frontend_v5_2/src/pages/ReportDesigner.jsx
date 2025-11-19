import React, { useState } from 'react'
import { makeClient } from '../api'
export default function ReportDesigner({api, token}){
  const [name, setName] = useState('Executive Summary')
  const [blocks, setBlocks] = useState([{type:'title', text:'Q2 Performance Highlights', x:1, y:1, w:8, h:1},{type:'text', text:'Margins improved in May due to COGS control.', x:1, y:2, w:8, h:2}])
  const [file, setFile] = useState('')
  function updateBlock(i,k,v){ setBlocks(bs => bs.map((b,ix)=> ix===i ? {...b, [k]: v} : b)) }
  async function render(){ const client = makeClient(api, token); const { data } = await client.post('/reports/render', { name, blocks }); setFile(data.file) }
  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="font-medium">Report Designer</div>
      <label className="text-sm">Report Name</label>
      <input className="border rounded px-2 py-1" value={name} onChange={e=>setName(e.target.value)} />
      <div className="space-y-2">{blocks.map((b,i)=>(
        <div key={i} className="border rounded p-2">
          <div className="text-xs text-slate-500">Block {i+1}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select value={b.type} onChange={e=>updateBlock(i,'type',e.target.value)} className="border rounded px-2 py-1"><option value="title">title</option><option value="text">text</option></select>
            <input className="border rounded px-2 py-1 col-span-3" value={b.text} onChange={e=>updateBlock(i,'text',e.target.value)} />
            {['x','y','w','h'].map(k=> <input key={k} className="border rounded px-2 py-1" value={b[k]} onChange={e=>updateBlock(i,k,e.target.value)} placeholder={k} />)}
          </div>
        </div>
      ))}</div>
      <button onClick={render} className="px-3 py-2 rounded bg-slate-900 text-white">Render PPTX</button>
      {file && <div className="text-sm mt-2">Server created: <code>{file}</code></div>}
    </div>
  )
}