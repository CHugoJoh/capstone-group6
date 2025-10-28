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

export async function analyzeReports(
  user_id: string | null,   
  reports: ReportData[],
  prompt: string
): Promise<{ message: string | null }> {
  const res = await fetch(`http://localhost:8000/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({user_id, reports, prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze reports");
  }

  return res.json();
}
//export async function addUser(user: User);
export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const user = await res.json();
  return user;
}
export async function getUserPrompts(user_id: string) {
  const res = await fetch(`http://localhost:8000/prompts/user/${user_id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user prompts");
  }
  const prompts = await res.json();
  return prompts;
}
//export async function updateUser(id: string, user: Partial<User>): Promise<User>;




