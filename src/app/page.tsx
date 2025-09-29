import { columns } from "./reports/columns"
import { DataTable } from "../components/data-table"
import { ReportData } from "./data/ReportData"

async function getData(): Promise<ReportData[]> {
  // Simulate a delay to mimic fetching data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return the static data for now
  const { reports } = await import("./data/ReportData")
  return reports
}

export default async function MainPage() {
  const data = await getData()

  return (
    <main className="container mx-auto py-10">
      <div className="top-bar">
        <div className="logo">
          <span>RAPPORTÖR</span>
        </div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Reports</a>
          <a href="#">Analytics</a>
          <a href="#">Settings</a>
        </nav>
    </div>
      <h1 className="text-3xl font-bold ml-5 mt-6 mb-6">All reports</h1>
      {/* Pass generic types to DataTable */}
      <DataTable<ReportData, any> columns={columns} data={data} />
    </main>
  )
}
