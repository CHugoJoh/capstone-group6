"use client"

import { useState, useEffect } from "react"

import { UserPrompt } from "../data/UserPrompt"
import { useAuth } from "../context/AuthContext"

export default function UserPage() {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<UserPrompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<UserPrompt | null>(null)

  useEffect(() => {
    if (!user) return
    const fetchPrompts = async () => {
      const res = await fetch(`http://localhost:8000/prompts/user/${user.user_id}`)
      if (res.ok) {
        const data = await res.json()
        setPrompts(data)
      }
    }
    fetchPrompts()
  }, [user])

  if (!user) return <p>Please log in.</p>

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">History</h2>
        {prompts.map((prompt) => (
          <button
            key={prompt.prompt_id}
            onClick={() => setSelectedPrompt(prompt)}
            className={`block text-left w-full p-2 mb-2 rounded hover:bg-gray-100 ${
              selectedPrompt?.prompt_id === prompt.prompt_id
                ? "bg-gray-200"
                : ""
            }`}
          >
            <p className="font-medium text-sm truncate">{prompt.prompt_text}</p>
            <p className="text-xs text-gray-500">
              {new Date(prompt.created_at).toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">
          Hej {user.first_name}!
        </h1>

        {selectedPrompt ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Prompt</h2>
            <p className="mb-4 whitespace-pre-line">{selectedPrompt.prompt_text}</p>

            <h2 className="text-lg font-semibold mb-2">Response</h2>
            <p className="whitespace-pre-line">{selectedPrompt.body}</p>
          </div>
        ) : (
          <p className="text-gray-500">Select a prompt from the left to view its response.</p>
        )}
      </div>
    </div>
  )
}
