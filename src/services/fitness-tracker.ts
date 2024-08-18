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

  // this is garbage and the compiler wouldn't let me do this dynamically
  public workoutIterativeForm(workout:Workout){
    let results = [];
    let i = 0;
    let nameIdx = 0;


    if ("warmup" in workout) {
      results.push("WARMUP");
      while (i < (workout.warmup ? workout.warmup.length : -1)) {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_warm ? workout.rest_warm[i] : "");
        results.push(workout.reps_warm ? workout.reps_warm[i] : "");
        results.push(workout.tempo_warm ? workout.tempo_warm[i] : "");
        results.push(workout.sets_warm ? workout.sets_warm[i] : "");
        results.push(workout.special_notes_warm ? workout.special_notes_warm[i] : "");
        nameIdx++;
        i++;
      }
      results.push("END WARMUP");
    }

    if ("superset_1" in workout) {
      let n = workout.superset_1 ? workout.superset_1.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_1? workout.rest_1[i] : "");
        results.push(workout.reps_1? workout.reps_1[i] : "");
        results.push(workout.tempo_1? workout.tempo_1[i] : "");
        results.push(workout.sets_1? workout.sets_1[i] : "");
        results.push(workout.special_notes_1 ? workout.special_notes_1[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET")
    }


    if ("superset_2" in workout) {
      let n = workout.superset_2 ? workout.superset_2.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_2? workout.rest_2[i] : "");
        results.push(workout.reps_2? workout.reps_2[i] : "");
        results.push(workout.tempo_2? workout.tempo_2[i] : "");
        results.push(workout.sets_2? workout.sets_2[i] : "");
        results.push(workout.special_notes_2 ? workout.special_notes_2[i] : "");

        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_3" in workout) {
      let n = workout.superset_3 ? workout.superset_3.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_3? workout.rest_3[i] : "");
        results.push(workout.reps_3? workout.reps_3[i] : "");
        results.push(workout.tempo_3? workout.tempo_3[i] : "");
        results.push(workout.sets_3? workout.sets_3[i] : "");
        results.push(workout.special_notes_3 ? workout.special_notes_3[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_4" in workout) {
      let n = workout.superset_4 ? workout.superset_4.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_4? workout.rest_4[i] : "");
        results.push(workout.reps_4? workout.reps_4[i] : "");
        results.push(workout.tempo_4? workout.tempo_4[i] : "");
        results.push(workout.sets_4? workout.sets_4[i] : "");
        results.push(workout.special_notes_4 ? workout.special_notes_4[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_5" in workout) {
      let n = workout.superset_5 ? workout.superset_5.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_5? workout.rest_5[i] : "");
        results.push(workout.reps_5? workout.reps_5[i] : "");
        results.push(workout.tempo_5? workout.tempo_5[i] : "");
        results.push(workout.sets_5? workout.sets_5[i] : "");
        results.push(workout.special_notes_5 ? workout.special_notes_5[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_6" in workout) {
      let n = workout.superset_6 ? workout.superset_6.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_6? workout.rest_6[i] : "");
        results.push(workout.reps_6? workout.reps_6[i] : "");
        results.push(workout.tempo_6? workout.tempo_6[i] : "");
        results.push(workout.sets_6? workout.sets_6[i] : "");
        results.push(workout.special_notes_6 ? workout.special_notes_6[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_7" in workout) {
      let n = workout.superset_7 ? workout.superset_7.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_7? workout.rest_7[i] : "");
        results.push(workout.reps_7? workout.reps_7[i] : "");
        results.push(workout.tempo_7? workout.tempo_7[i] : "");
        results.push(workout.sets_7? workout.sets_7[i] : "");
        results.push(workout.special_notes_7? workout.special_notes_7[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_8" in workout) {
      let n = workout.superset_8 ? workout.superset_8.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_8? workout.rest_8[i] : "");
        results.push(workout.reps_8? workout.reps_8[i] : "");
        results.push(workout.tempo_8? workout.tempo_8[i] : "");
        results.push(workout.sets_8? workout.sets_8[i] : "");
        results.push(workout.special_notes_8 ? workout.special_notes_8[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_9" in workout) {
      let n = workout.superset_9 ? workout.superset_9.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_9? workout.rest_9[i] : "");
        results.push(workout.reps_9? workout.reps_9[i] : "");
        results.push(workout.tempo_9? workout.tempo_9[i] : "");
        results.push(workout.sets_9? workout.sets_9[i] : "");
        results.push(workout.special_notes_9 ? workout.special_notes_9[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }

    if ("superset_10" in workout) {
      let n = workout.superset_10 ? workout.superset_10.length : -1;
      results.push("SUPERSET");
      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_10? workout.rest_10[i] : "");
        results.push(workout.reps_10? workout.reps_10[i] : "");
        results.push(workout.tempo_10? workout.tempo_10[i] : "");
        results.push(workout.sets_10? workout.sets_10[i] : "");
        results.push(workout.special_notes_10 ? workout.special_notes_10[i] : "");
        nameIdx++;
      }
      results.push("END SUPERSET");
    }


    return results;
  }



}


