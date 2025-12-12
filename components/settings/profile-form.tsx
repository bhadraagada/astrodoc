"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"

type Profile = {
  name: string
  email: string
  bio?: string
}

const STORAGE_KEY = "astrodoc:profile"

export default function ProfileForm() {
  const { user } = useUser() as any
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", bio: "" })

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (saved) {
      try {
        setProfile(JSON.parse(saved))
      } catch (e) {
        // ignore parse
      }
    } else if (user) {
      setProfile((p) => ({ ...p, email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? "" }))
    }
  }, [user])

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      // TODO: call Convex mutation to persist to server-side
      alert("Profile saved locally. We can wire Convex/Server saving next.")
    } catch (e) {
      console.error(e)
      alert("Failed to save profile")
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm block mb-1">Name</label>
        <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      </div>

      <div>
        <label className="text-sm block mb-1">Email</label>
        <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
      </div>

      <div>
        <label className="text-sm block mb-1">Bio</label>
        <Input value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
      </div>

      <div className="pt-2">
        <Button onClick={save}>Save Profile</Button>
      </div>
    </div>
  )
}
