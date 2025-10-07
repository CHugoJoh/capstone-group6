"use client"

import * as React from "react"
import { ReportData } from "@/app/data/ReportData"
import { AiButton } from "./ai-button"

interface AiButtonGroupProps {
  data: ReportData[]
  onResult: (result: string) => void
}

export function AiButtonGroup({ data, onResult }: AiButtonGroupProps) {
  const quickPrompts = [
    { label: "Summarize Reports", prompt: "Summarize key insights from selected reports." },
    { label: "Identify Issues", prompt: "Identify common issues across selected reports." },
  ]

  return (
    <div className="flex mt-4 mb-2 ml-4">
      {quickPrompts.map(q => (
        <AiButton
          key={q.label}
          data={data}
          prompt={q.prompt}
          label={q.label}
          onResult={onResult}
        />
      ))}
    </div>
  )
}
