import { ReportData } from "./data/ReportData"

export async function getAllReportData(): Promise<ReportData[]> {
  const res = await fetch("http://localhost:8000/incidents");
  if (!res.ok) {
    throw new Error("Failed to fetch incidents");
  }
  const data: ReportData[] = await res.json();
  return data;
}

