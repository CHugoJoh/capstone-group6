"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { analyzeReports } from "@/app/api"
import { selectedRows } from "@/app/table/columns"
import { ReportData } from "@/app/data/ReportData"
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext"


interface AiButtonProps {
  data: ReportData[]
  prompt: string
  label: string
  onResult: (result: string) => void // pass results up to DataTable
}

export function AiButton({ data, prompt, label, onResult }: AiButtonProps) {
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(false)

  const handleAnalyze = async () => {
    if (!selectedRows.size) {
      alert("Please select some reports first.")
      return
    }

    const reports = data
      .filter(r => selectedRows.has(r.number))
      .map(r => ({
        ...r,
        location: r.location ?? "",
        factory: r.factory ?? "",
        unit: r.unit ?? "",
        what_happened: r.what_happened ?? "",
      }))

    try {
      setLoading(true)
      const response = await analyzeReports(user?.user_id ?? null, reports, prompt)
      onResult(response.message || "AI analysis complete!")
      toast("AI analysis complete! Response has been saved.");
    } catch (err) {
      console.error(err)
      alert("Failed to analyze reports.")
      toast("AI analysis failed!");
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAnalyze}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-700 text-white ml-2"
    >
      {loading ? "Analyzing..." : label}
    </Button>
  )
}
