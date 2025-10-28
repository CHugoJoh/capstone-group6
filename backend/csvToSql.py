import pandas as pd
from sqlalchemy import create_engine

# Quick thing to get the data into the database
csv_path = r"insert file path here"

df = pd.read_csv(csv_path)

if "Did the injury happen during overtime?" in df.columns:
   df["Did the injury happen during overtime?"] = df["Did the injury happen during overtime?"].map(
        {"Yes": True, "No": False}    )

engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/postgres")


df.to_sql("incidents", engine, if_exists="append", index=False)