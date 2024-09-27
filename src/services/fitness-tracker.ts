import {EventEmitter, Injectable, Output} from '@angular/core';
import {Exercise} from "../exercise";
import { MuscleGroup, Category } from "../exercise-enums";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, Observable, retry, throwError} from "rxjs";
import {Workout} from "../workout";

@Injectable({
  providedIn: 'root'
})
export class FitnessTracker {
  private exerciseList: Exercise[];
  private workoutList: Workout[];
  private exerciseListUpdated: boolean;
  private workoutListUpdated: boolean;

  constructor(private http: HttpClient) {
    this.exerciseList = [];
    this.workoutList = [];
    this.exerciseListUpdated = false;
    this.workoutListUpdated = false;
  }

  public setWorkoutList(updatedList:Workout[]){
    this.workoutList = updatedList;
    this.workoutListUpdated = false;
  }

  public setExerciseList(updatedList:Exercise[]){
    this.exerciseList = updatedList;
    this.exerciseListUpdated = false;
  }

  public getExerciseList(){
    if(this.exerciseListUpdated || this.exerciseList.length == 0){
      return this.http.get<Exercise[]>("http://localhost:8000/exerciseList");
    }
    else{
      return this.exerciseList;
    }
  }

  public getWorkoutList(){
    if(this.workoutListUpdated || this.workoutList.length == 0){
      return this.http.get<Workout[]>("http://localhost:8000/workoutList");
    }
    else{
      return this.workoutList;
    }
  }

  public getExerciseById(id: number){
    if(this.exerciseListUpdated || this.exerciseList.length == 0){
      return this.http.get<Exercise>(`http://localhost:8000/exerciseById/${id}`)
    }
    else{
      return this.exerciseList[id];
    }
  }


  public addExercise(newExercise:Exercise){
    //this.exerciseList.push({name:newExercise.name,category:newExercise.category,group:newExercise.group});
  }

  public addWorkout(newWorkout:Workout){
    return this.http.post<Workout>("http://localhost:8000/addWorkout",newWorkout)

  }

  public removeExercise(id:number){

  }

  public getWorkoutById(id:number){
    return this.http.get<Workout>(`http://localhost:8000/workoutById/${id}`)
  }

  private handleHttpError(error: HttpErrorResponse){
    if (error.status === 0){
      console.error("An error occured:",error.error);
    }
    else{
      console.error('Backend returned code ${error.status}, body was: ',error.error);
    }

    return throwError(() => new Error("Something bad happend; please try again later"));
  }

}


