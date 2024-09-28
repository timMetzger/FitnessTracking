import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import db_helper
from pydantic import BaseModel

class ExercisePrescription(BaseModel):
  id:int
  name:str
  reps:str
  rest:str
  sets:str
  tempo:str
  special_notes:str
class Workout(BaseModel):
  name:str
  type:str
  created_by:str
  warmup:list[ExercisePrescription]
  supersets:list[list[ExercisePrescription]]

class WorkoutResults(BaseModel):
  weight:list[int]
  reps:list[int]

class Session(BaseModel):
  id:int
  workout_id:int
  workout_results:list[WorkoutResults]

class WorkoutEvent(BaseModel):
  title:str
  date:str
  id:str
  extendedProps:dict



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

@app.get("/getScheduledEvents")
async def workoutList():
  return db_helper.get_scheduled_events()

@app.get("/exerciseById/{id}")
async def exByID(id: int):
    return db_helper.get_exercise_by_id(id)

@app.get("/workoutById/{id}")
async def exByID(id: int):
    return db_helper.get_workout_by_id(id)

@app.post("/addWorkout/")
async def addWorkout(workoutObject: Workout):
  return db_helper.add_workout(jsonable_encoder(workoutObject))

@app.post("/addEvent/")
async def addWorkout(eventObject:WorkoutEvent):
  return db_helper.add_workout(jsonable_encoder(eventObject))

@app.post("/updateSession/")
async def addWorkout(sessionObject: Session):
  return db_helper.add_workout(jsonable_encoder(sessionObject))



if __name__ == "__main__":
  uvicorn.run(app,host="0.0.0.0",port=8000)
