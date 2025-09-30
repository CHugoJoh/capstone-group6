import psycopg2
import pandas as pd


# csv_path = r"C:\Users\hugoc\Desktop\Namnlöst kalkylark - Page 1.csv"

# df = pd.read_csv(csv_path)

# # Map overtime column (Yes/No to boolean) if needed
# if "Did the injury happen during overtime?" in df.columns:
#     df["Did the injury happen during overtime?"] = df["Did the injury happen during overtime?"].map(
#         {"Yes": True, "No": False}
#     )

# # Connect to Postgres
# engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/postgres")

# # Insert into DB
# df.to_sql("Incidents", engine, if_exists="append", index=False)

connection = psycopg2.connect(database="postgres", user="postgres", password="postgres", host="localhost", port=5432)

cursor = connection.cursor()
print(cursor.name)

cursor.execute("SELECT * FROM incidents;")

record = cursor.fetchall()

print("Data from Database:- ", record)