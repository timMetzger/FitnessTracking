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

  public getExerciseList(init:boolean){
    if(this.exerciseListUpdated || init){
      return this.http.get<Exercise[]>("http://localhost:8000/exerciseList");
    }
    else{
      return this.exerciseList;
    }
  }

  public getWorkoutList(init:boolean){
    if(this.workoutListUpdated || init){
      return this.http.get<Workout[]>("http://localhost:8000/workoutList");
    }
    else{
      return this.workoutList;
    }
  }

  public getExerciseById(id: number){
    if(this.exerciseListUpdated || this.exerciseList.length == 0){
      console.log(`http://localhost:8000/exerciseById/${id}`);
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
    // add workout here
  }

  public removeExercise(id:number){

  }

}


