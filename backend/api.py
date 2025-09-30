from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor

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
