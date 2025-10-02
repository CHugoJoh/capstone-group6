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
      <div className="flex items-center justify-between mb-6 ml-5">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white">
          New Analysis
        </Button>
      </div>
      <DataTable data={data} />
    </main>
  )
}
