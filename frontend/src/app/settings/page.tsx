"use client";

import LocaleSwitcher from "@/components/locale-switcher";

export default function settingsPage() {
  return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <LocaleSwitcher />
      </main>
    )
}