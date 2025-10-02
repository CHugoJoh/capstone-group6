"use client"

import { useEffect, useState } from "react"
import { DataTable } from "../../components/data-table"
import { ReportData } from "../data/ReportData"
import { Button } from "@/components/ui/button"
import { getAllReportData } from "../api"

export default function MainPage() {
  const [data, setData] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllReportData()
      .then((res) => setData(res))
      .catch((err) => {
        console.error(err)
        setError("Failed to load reports")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-4">Loading reports...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <DataTable data={data} />
    </main>
  )
}
