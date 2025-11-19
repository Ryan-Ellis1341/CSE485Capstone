import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

export function TrendChart({data, x='month', y='value', title='Trend'}){
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="font-medium mb-2">{title}</div>
      <div style={{width:'100%', height:300}}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={y} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function Waterfall({data, x='label', y='value', title='Waterfall'}){
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="font-medium mb-2">{title}</div>
      <div style={{width:'100%', height:300}}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={y} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}