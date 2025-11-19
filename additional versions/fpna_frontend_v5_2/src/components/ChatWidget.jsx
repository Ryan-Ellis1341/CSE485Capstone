import React, { useEffect, useMemo, useRef, useState } from 'react'
import { makeClient } from '../api'
export default function ChatWidget({api, token, userId="student", threadId="global", year=2027, scenario="2027:Base"}){
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [msgs, setMsgs] = useState([])
  const wsRef = useRef(null)
  const wsUrl = useMemo(()=> api.replace('http','ws') + `/chat/ws?thread_id=${encodeURIComponent(threadId)}&user_id=${encodeURIComponent(userId)}`, [api, threadId, userId])

  async function loadHistory(){
    try{ const client = makeClient(api, token); const { data } = await client.get('/chat/messages', { params: { thread_id: threadId } }); setMsgs(data.messages||[]) }catch(e){}
  }
  useEffect(()=>{ if(open){ loadHistory() } }, [open])
  useEffect(()=>{
    if(!open) return
    const ws = new WebSocket(wsUrl); wsRef.current = ws
    ws.onmessage = (evt) => { try{ const data = JSON.parse(evt.data); if(data.type === 'message'){ setMsgs(m => [...m, data.message]) } }catch{} }
    ws.onerror = () => {}; ws.onclose = () => {}; return () => { ws.close() }
  }, [open, wsUrl])

  async function send(text){
    const m = { thread_id: threadId, user_id: userId, role: 'user', text }
    try{
      if(wsRef.current && wsRef.current.readyState === WebSocket.OPEN){ wsRef.current.send(JSON.stringify(m)) }
      else { const client = makeClient(api, token); await client.post('/chat/messages', m); setMsgs(x => [...x, { ...m, ts: Date.now()/1000 }]) }
      setInput("")
    }catch(e){}
  }
  async function askAI(){
    const client = makeClient(api, token); const q = input || 'Why were margins down last quarter?'
    const { data } = await client.post('/assistant/ask', { question: q, year, scenario })
    setMsgs(x => [...x, { thread_id: threadId, user_id: 'assistant', role: 'assistant', text: data.answer, ts: Date.now()/1000 }])
    setInput("")
  }
  return (<>
    <button onClick={()=>setOpen(v=>!v)} className="fixed bottom-4 right-4 px-4 py-2 rounded-full shadow bg-slate-900 text-white">{open ? 'Close Chat' : 'Support & AI Chat'}</button>
    {open && (
      <div className="fixed bottom-20 right-4 w-96 bg-white border rounded-xl shadow-lg flex flex-col">
        <div className="px-3 py-2 border-b font-medium">Support & AI</div>
        <div id="chat-scroll" className="p-3 space-y-2 overflow-auto" style={{maxHeight: '50vh'}}>
          {msgs.map((m,i)=> (
            <div key={i} className={`px-3 py-2 rounded ${m.role==='user' ? 'bg-slate-100' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="text-xs text-slate-500 mb-1">{m.user_id} • {m.role}</div>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            </div>
          ))}
          {!msgs.length && <div className="text-sm text-slate-500">No messages yet. Ask a question!</div>}
        </div>
        <div className="p-2 border-t flex gap-2">
          <input className="border rounded px-2 py-1 flex-1" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message or a question..." />
          <button className="px-3 py-1 rounded border" onClick={()=>send(input)} disabled={!input.trim()}>Send</button>
          <button className="px-3 py-1 rounded bg-slate-900 text-white" onClick={askAI}>Ask AI</button>
        </div>
      </div>
    )}
  </>)
}