"use client"

import React from "react"
import ThemeToggle from "@/components/theme-toggle"
import ProfileForm from "@/components/settings/profile-form"
import HydrationTracker from "@/components/settings/hydration-tracker"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-deep-space text-star-white py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-semibold mb-4">Settings</h1>

        <section className="mb-8 rounded-md bg-surface/40 p-6 border border-slate-700">
          <h2 className="text-lg font-medium mb-3">Appearance</h2>
          <p className="text-sm text-muted-foreground mb-4">Toggle theme between light and dark.</p>
          <ThemeToggle />
        </section>

        <section className="mb-8 rounded-md bg-surface/40 p-6 border border-slate-700">
          <h2 className="text-lg font-medium mb-3">Profile</h2>
          <p className="text-sm text-muted-foreground mb-4">Manage your profile information. Some fields come from your auth provider.</p>
          <ProfileForm />
        </section>

        <section className="mb-8 rounded-md bg-surface/40 p-6 border border-slate-700">
          <h2 className="text-lg font-medium mb-3">Hydration Tracker</h2>
          <p className="text-sm text-muted-foreground mb-4">Log and track your daily water intake. Data is stored locally for now; we can wire Convex later.</p>
          <HydrationTracker />
        </section>
      </div>
    </div>
  )
}
