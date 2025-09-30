"use client"

import { useEffect, useState } from "react"
import { columns } from "../table/columns"
import { DataTable } from "../../components/data-table"
import { ReportData } from "../data/ReportData"
import { Button } from "@/components/ui/button"
import { getAllReportData } from "../api"

export default function MainPage() {
  const [data, setData] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllReportData()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6 ml-5">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white">
          New Analysis
        </Button>
      </div>
      <DataTable<ReportData, any> columns={columns} data={data} />
    </main>
  )
}
