"use client"

import * as React from "react"
import { ReportData } from "@/app/data/ReportData"
import { AiButton } from "./ai-button"
import { Input } from "@/components/ui/input"

interface AiCustomPromptProps {
  data: ReportData[]
  onResult: (result: string) => void
}

export function AiCustomPrompt({ data, onResult }: AiCustomPromptProps) {
  const [customPrompt, setCustomPrompt] = React.useState("")

  return (
    <div className="flex items-center mt-2 ml-5 mb-4">
      <Input
        placeholder="Type custom prompt..."
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        className="max-w-lg mr-2"
      />
      <AiButton
        data={data}
        prompt={"Custom prompt: " + customPrompt + " Analyze selected reports taking into account the custom prompt."}
        label="Analyze Custom"
        onResult={onResult}
      />
    </div>
  )
}
