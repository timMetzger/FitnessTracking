import {EventEmitter, Injectable, Output} from '@angular/core';
import {Exercise} from "../exercise";
import { MuscleGroup, Category } from "../exercise-enums";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private exerciseList: Exercise[]

  constructor() {
    this.exerciseList = this.setExercistList();
  }
  private setExercistList(){
    return [{name:"Bicep Curls",category:Category.Upper,group:MuscleGroup.Biceps}]
  }

  private setPrettyList(){
    let l = []

    for(let e of this.exerciseList) {
      l.push({name:e.name,category:Category[e.category],group:MuscleGroup[e.group]});
    }
    return l;
  }

  public removeExercise(id:number){

  }

  public getExerciseList(){
    return this.exerciseList
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
    this.exerciseList.push({name:newExercise.name,category:newExercise.category,group:newExercise.group});
  }
}


