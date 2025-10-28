from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from Types.User import User
import bcrypt

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

#Incident region#
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

from typing import Optional

class Report(BaseModel):
    number: str
    unit: str
    factory: str
    location: Optional[str]
    what_happened: str

class AnalyzeRequest(BaseModel):
    user_id: str
    reports: list[Report]
    prompt: str

@app.post("/analyze")
def analyze_reports(request: AnalyzeRequest):
    client = OpenAI()

    reports_text = "\n\n".join([
        f"Report {r.number} - Unit: {r.unit}, Factory: {r.factory}, Location: {r.location}\nWhat happened: {r.what_happened}"
        for r in request.reports
    ])

    full_prompt = f"{request.prompt}\n\n{reports_text}"

    response = client.responses.create(
        model="gpt-4.1",
        input=[{"role": "user", "content": [{"type": "input_text", "text": full_prompt}]}]
    )

    output_text = response.output_text

    # Store the result
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO user_prompts (user_id, prompt_text, body)
        VALUES (%s, %s, %s);
        """,
        (request.user_id, full_prompt, output_text)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": output_text}

#User region

class User(BaseModel):
    user_id: Optional[str]
    first_name: str
    last_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/users")
def get_users():
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT user_id, first_name, last_name, email FROM users;")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return records

@app.get("/users/{user_id}")
def get_user(user_id: str):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT user_id, first_name, last_name, email FROM users WHERE user_id = %s;", (user_id,))
    record = cursor.fetchone()
    cursor.close()
    conn.close()

    if not record:
        raise HTTPException(status_code=404, detail="User not found")
    return record

@app.post("/users")
def create_user(user: User):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # Hash password before storing
    hashed_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    cursor.execute("""
        INSERT INTO users (user_id, first_name, last_name, email, password)
        VALUES (gen_random_uuid(), %s, %s, %s, %s)
        RETURNING user_id, first_name, last_name, email;
    """, (user.first_name, user.last_name, user.email, hashed_pw))

    new_user = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return new_user

@app.post("/auth/login")
def login_user(login_request: LoginRequest):
    email = login_request.email
    password = login_request.password

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s;", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user_id": user["user_id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"]
    }

# Prompt region #
class Prompt(BaseModel):
    prompt_id: Optional[str]
    user_id: str
    prompt_text: str
    body: str

@app.get("/prompts")
def get_prompts():
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM user_prompts;")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return records

@app.get("/prompts/{prompt_id}")
def get_prompt(prompt_id: str):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM user_prompts WHERE prompt_id = %s;", (prompt_id,))
    record = cursor.fetchone()
    cursor.close()
    conn.close()

    if not record:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return record

@app.get("/prompts/user/{user_id}")
def get_user_prompts(user_id: str):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM user_prompts WHERE user_id = %s;", (user_id,))
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return records