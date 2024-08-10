import {EventEmitter, Injectable, Output} from '@angular/core';
import {Exercise} from "../exercise";
import { MuscleGroup, Category } from "../exercise-enums";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, Observable, retry, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private exerciseList: Exercise[];
  private hasUpdated: boolean;

  constructor(private http: HttpClient) {
    this.exerciseList = [];
    this.hasUpdated = false;
  }


  private setPrettyList(){
  }

  public removeExercise(id:number){

  }

  public getExerciseList(init:boolean=false){
    return this.http.get<Exercise[]>("http://localhost:8000/");
  }

  public getExerciseCategories(){
    let categoryList = [];
    for(let member in Category)
      {
        if(typeof Category[member] != 'number'){
          categoryList.push(Number(member));
        }
      }
    return categoryList
  }

  public getExerciseMuscleGroups(){
    let muscleGroupList = [];
    for(let member in MuscleGroup)
    {
      if(typeof MuscleGroup[member] != 'number'){
        muscleGroupList.push(Number(member));
      }
    }
    return muscleGroupList;
  }

  public addExercise(newExercise:Exercise){
    //this.exerciseList.push({name:newExercise.name,category:newExercise.category,group:newExercise.group});
  }

}


