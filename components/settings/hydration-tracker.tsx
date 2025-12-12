"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Entry = { amount: number; timestamp: number }

const STORAGE_KEY = "astrodoc:hydration"

export default function HydrationTracker() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [amount, setAmount] = useState<number>(250)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    const e: Entry = { amount: Number(amount), timestamp: Date.now() }
    setEntries((s) => [e, ...s])
  }

  const clear = () => {
    setEntries([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input value={String(amount)} type="number" onChange={(e) => setAmount(Number(e.target.value))} />
        <Button onClick={addEntry}>Add ml</Button>
        <Button variant="outline" onClick={clear}>Clear</Button>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Recent Entries</h3>
        <ul className="space-y-2 max-h-48 overflow-auto">
          {entries.length === 0 && <li className="text-sm text-muted-foreground">No entries yet</li>}
          {entries.map((e, idx) => (
            <li key={e.timestamp} className="text-sm flex justify-between">
              <span>{new Date(e.timestamp).toLocaleString()}</span>
              <span className="font-semibold">{e.amount} ml</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
