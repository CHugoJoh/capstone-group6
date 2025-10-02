from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    return psycopg2.connect(
        database="postgres",
        user="postgres",
        password="postgres",
        host="localhost",
        port=5432
    )

@app.get("/incidents")
def get_incidents():
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM incidents;")
    records = cursor.fetchall()
    cursor.close()
    conn.close()

    cleaned = []
    for r in records:
        cleaned.append({
            "number": r["Number"],
            "unit": r["Unit"],
            "factory": r["Factory"],
            "location": r["Location"],
            "where_happened": r["Where did it happen"],
            "what_happened": r["What happened?"],
            "reported_by": r["Reported by"],
            "responsible": r["Select Team Leader or other responsible"],
            "state": r["State"],
            "report_from": r["Report from"],
            "when_happened": r["When did it happen?"],
            "area": r["Area"],
            "category": r["Category"],
            "sub_category": r["Sub-Category"],
            "team": r["Choose your team"],
            "worker_type": r["Type of worker"],
            "work_context": r["During what kind of work did the incident happen?"],
            "injury_type": r["What type of injury:"],
            "reported_by_group": r["Reported by Group Account"],
            "risk_type": r["What kind of risk"],
            "overtime": r["Did the injury happen during overtime?"],
        })
    return cleaned

@app.get("/incidents/{incident_number}") #get one report
def get_single_incident(incident_number: str):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM incidents WHERE \"Number\" = %s;", (incident_number,))
    record = cursor.fetchone()
    cursor.close()
    conn.close()

    if record:
        return {
            "number": record["Number"],
            "unit": record["Unit"],
            "factory": record["Factory"],
            "location": record["Location"],
            "where_happened": record["Where did it happen"],
            "what_happened": record["What happened?"],
            "reported_by": record["Reported by"],
            "responsible": record["Select Team Leader or other responsible"],
            "state": record["State"],
            "report_from": record["Report from"],
            "when_happened": record["When did it happen?"],
            "area": record["Area"],
            "category": record["Category"],
            "sub_category": record["Sub-Category"],
            "team": record["Choose your team"],
            "worker_type": record["Type of worker"],
            "work_context": record["During what kind of work did the incident happen?"],
            "injury_type": record["What type of injury:"],
            "reported_by_group": record["Reported by Group Account"],
            "risk_type": record["What kind of risk"],
            "overtime": record["Did the injury happen during overtime?"],
        }
    return {"error": "Incident not found"}

class Report(BaseModel):
    number: str
    unit: str
    factory: str
    location: str
    what_happened: str

class AnalyzeRequest(BaseModel):
    reports: list[Report]

@app.post("/analyze")
def analyze_reports(request: AnalyzeRequest):
    client = OpenAI()

    reports_text = "\n\n".join([
        f"Report {r.number} - Unit: {r.unit}, Factory: {r.factory}, Location: {r.location}\nWhat happened: {r.what_happened}"
        for r in request.reports
    ])

    response = client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": f"Analyze these incident reports and summarize key issues:\n\n{reports_text}"
                    }
                ]
            }
        ]
    )

    return {"message": response.output_text}
