import { columns } from "../table/columns"
import { DataTable } from "../../components/data-table"
import { ReportData } from "../data/ReportData"
import { Button } from "@/components/ui/button"

async function getData(): Promise<ReportData[]> {
  const { reports } = await import("../data/ReportData")
  return reports
}

export default async function MainPage() {
  const data = await getData()

  return (
    <main className="container mx-auto p-4">
      {/* Header with title and button */}
      <div className="flex items-center justify-between mb-6 ml-5">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white">
          New Analysis
        </Button>
      </div>

      {/* Data table */}
      <DataTable<ReportData, any> columns={columns} data={data} />
    </main>
  )
}
