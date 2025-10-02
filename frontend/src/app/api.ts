import { ReportData } from "./data/ReportData"

export async function getAllReportData(): Promise<ReportData[]> {
  const res = await fetch("http://localhost:8000/incidents");
  if (!res.ok) {
    throw new Error("Failed to fetch incidents");
  }
  const data: ReportData[] = await res.json();
  return data;
}
export async function getReportDataById(id: string): Promise<ReportData | null> {
  const res = await fetch(`http://localhost:8000/incidents/${id}`);
  if (res.status === 404) {
    return null; // Report not found
  }
  if (!res.ok) {
    throw new Error("Failed to fetch incident");
  }
  const data: ReportData = await res.json();
  return data;
}
export async function analyzeReports(reports: ReportData[]): Promise<{ message: string | null }> {
  const res = await fetch(`http://localhost:8000/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reports }),
  });
  if (!res.ok) {
    throw new Error("Failed to analyze reports");
  }
  return res.json();
}



