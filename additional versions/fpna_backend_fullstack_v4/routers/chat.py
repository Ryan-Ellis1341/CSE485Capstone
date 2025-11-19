from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel
from sqlalchemy import text
from services.db import engine
import time

router = APIRouter(prefix="/chat", tags=["chat"])

class Message(BaseModel):
    thread_id:str; user_id:str; role:str; text:str

@router.get("/messages")
def list_messages(thread_id:str):
    with engine.begin() as conn:
        rows = [dict(r) for r in conn.exec_driver_sql('SELECT thread_id,user_id,role,text,ts FROM chat_messages WHERE thread_id=? ORDER BY id ASC', (thread_id,))]
    return {"messages": rows}

@router.post("/messages")
def post_message(msg:Message):
    with engine.begin() as conn:
        conn.exec_driver_sql('INSERT INTO chat_messages(thread_id,user_id,role,text,ts) VALUES(?,?,?,?,?)', (msg.thread_id, msg.user_id, msg.role, msg.text, time.time()))
    return {"status":"ok"}

class Hub:
    def __init__(self):
        self.rooms = {}

    async def connect(self, tid, ws:WebSocket):
        await ws.accept()
        self.rooms.setdefault(tid, []).append(ws)

    def drop(self, tid, ws):
        if tid in self.rooms and ws in self.rooms[tid]:
            self.rooms[tid].remove(ws)

    async def broadcast(self, tid, data):
        dead=[]
        for ws in self.rooms.get(tid, []):
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.drop(tid, ws)

hub = Hub()

@router.websocket("/ws")
async def ws_chat(websocket:WebSocket, thread_id:str=Query(...), user_id:str=Query("anon")):
    await hub.connect(thread_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            with engine.begin() as conn:
                conn.exec_driver_sql('INSERT INTO chat_messages(thread_id,user_id,role,text,ts) VALUES(?,?,?,?,?)', (thread_id, data.get('user_id',user_id), data.get('role','user'), data.get('text',''), time.time()))
            await hub.broadcast(thread_id, {"type":"message","message":data})
    except WebSocketDisconnect:
        hub.drop(thread_id, websocket)