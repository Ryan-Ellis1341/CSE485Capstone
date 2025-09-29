import React, { useState } from 'react'

export default function QuickBooks({API, auth, role}){
  const [json, setJson] = useState(`[
  {"Date":"2024-03-15","Account":"Sales - Food","Dept":"Sales","Amount":12345.67,"Currency":"USD"},
  {"Date":"2024-03-15","Account":"Wages","Dept":"Ops","Amount":3456.78,"Currency":"USD"}
]`)
  const canEdit = role==='Admin' || role==='Analyst'

  async function importJSON(){
    if(!canEdit){ alert('Viewer cannot import.'); return }
    const r = await fetch(`${API}/qb/import_json`, auth({method:'POST', body: json}))
    const js = await r.json()
    alert('Imported rows: ' + js.imported)
  }

  return (
    <div>
      <h3>QuickBooks Import (stub)</h3>
      <p>Paste QB-like JSON rows (Date, Account, Dept, Amount, Currency). We map to standardized accounts automatically.</p>
      <textarea style={{width:'100%', height:200}} value={json} onChange={e=>setJson(e.target.value)} />
      <br/>
      <button onClick={importJSON} disabled={!canEdit}>Import JSON</button>
      {!canEdit && <p style={{color:'crimson'}}>Login as Analyst/Admin to import.</p>}
    </div>
  )
}
