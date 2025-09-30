import {ChartPieSimple} from "@/components/report-chart"


export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-4 text-lg">
        Explore detailed analytics and insights from your reports here.
      </p>
    <ChartPieSimple></ChartPieSimple>
    </div>
  )
}