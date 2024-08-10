# from fastapi import FastAPI
#
# app = FastAPI()
#
#
# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
#
#
# @app.get("/hello/{name}")
# async def say_hello(name: str):
#     return {"message": f"Hello {name}"}
import psycopg2
import csv

DB_NAME = "FitnessDB"
DB_USER = "db_helper"
DB_PASS = "asetzgt418412dASq~234"
DB_HOST = "localhost"
DB_PORT = "5432"

class DB_HELPER:
  def __init__(self):
    pass


def establish_connection():
  conn = None
  try:
    conn = psycopg2.connect(database=DB_NAME,
                            user=DB_USER,
                            password=DB_PASS,
                            host=DB_HOST,
                            port=DB_PORT)

    print("Database connected successfully")
  except Exception as e:
    print("FAILURE: ", e)

  finally:
    return conn

def get_exercise_catalog():
  conn = establish_connection()
  if conn is not None:
    cursor = conn.cursor()
    sql = '''SELECT json_agg(t) FROM (SELECT * FROM public.exercises) t'''
    cursor.execute(sql)

    results = cursor.fetchall()
    conn.commit()
    conn.close()

    return results[0][0]

  else:
    return False

def load_table():
  try:
    conn = psycopg2.connect(database=DB_NAME,
                            user=DB_USER,
                            password=DB_PASS,
                            host=DB_HOST,
                            port=DB_PORT)

    cursor = conn.cursor()
    print("Database connected successfully")
  except Exception as e:
    print("FAILURE: ", e)
  finally:
    columns = '''(exercise, short_video, long_video, difficulty, target_muscle, primary_muscle, secondary_muscle, tertiary_muscle, equipment, posture, grip, movementPattern, plane_of_motion, body_region, force_type, mechanics, laterality, classification)'''
    inserted = set()
    with open("exercise_db.csv", mode='r') as f:
      csvFile = csv.reader(f)
      for line in csvFile:
        if line[0] in inserted:
          continue
        inserted.add(line[0])
        try:
          # Need to do some 'cleaning'
          for i, entry in enumerate(line):
            if "'" in entry:
              line[i] = line[i].replace("'", "~")

          sql = f'''INSERT INTO public.exercises {columns} VALUES{str(tuple(line))};'''
          print(sql)
          cursor.execute(sql)

        except Exception as e:
          print("FAILURE: ",e)

    conn.commit()
    conn.close()








