import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import db_helper

app = FastAPI()

origins = [
  "http://localhost:4200",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/exerciseList")
async def exerciseList():
    return db_helper.get_exercise_catalog()

@app.get("/workoutList")
async def workoutList():
  return db_helper.get_workout_catalog()


@app.get("/exerciseById/{id}")
async def exByID(id: int):
    return db_helper.get_exercise_by_id(id)


if __name__ == "__main__":
  uvicorn.run(app,host="0.0.0.0",port=8000)
