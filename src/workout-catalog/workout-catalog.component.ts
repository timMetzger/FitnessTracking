import {Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Exercise} from "../exercise";
import {NgForOf} from "@angular/common";
import { FitnessTracker } from "../services/fitness-tracker";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton} from "@angular/material/button";
import {Category, MuscleGroup} from "../exercise-enums";
import {catchError, debounceTime, map, Observable, retry, Subject, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Workout} from "../workout";
import {AddNewWorkoutButton} from "../new-workout/new-workout.component";
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-workout-catalog',
  standalone: true,
  imports: [AddNewWorkoutButton, NgForOf, MatTableModule, MatCheckbox, MatButton, MatFormFieldModule, MatInputModule, MatGridList, MatGridTile],
  templateUrl: './workout-catalog.component.html',
  styleUrl: './workout-catalog.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),])]
})
export class WorkoutCatalogComponent implements OnDestroy{
  private searchInput = new Subject<string>();
  private readonly debounceTimeMs = 250;
  public expandedWorkout = null;

  private service = inject(FitnessTracker)

  dataSource = new MatTableDataSource<Workout>([]);
  displayedColumns: string[] = ["name","type","last_completed"];
  detailColumns: string[] = ["name"]


  constructor() {
    this.getWorkouts(true);

    this.searchInput.pipe(
      debounceTime(this.debounceTimeMs)
    ).subscribe((searchTerm: string) => {
      this.performSearch(searchTerm);
    })
  }

  onSearch(event: Event){
    this.searchInput.next((event.target as HTMLInputElement).value);
  }

  performSearch(searchTerm: string){
    this.dataSource.filter = searchTerm;
  }

  ngOnDestroy() {
    this.searchInput.complete();
  }


  hasUpdated(result: boolean){
    if(result){
      this.getWorkouts();
    }
  }

  getWorkouts(init:boolean=false){
    let req = this.service.getWorkoutList(init);

    // Request can either be an http request observable or the request may already be stored
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          this.dataSource.data = data;
          console.log(data);
          this.service.setWorkoutList(data)

        },
        error => console.log(error),
      );
    }
    else{
      this.dataSource.data = req;
    }

  }

  public displayWorkout(workout:Workout) {
    let results = [];
    let i = 0;
    let nameIdx = 0;


    if ("warmup" in workout) {
      //results.push("WARMUP");TODO
      while (i < (workout.warmup ? workout.warmup.length : -1)) {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_warm ? workout.rest_warm[i] : -1);
        results.push(workout.reps_warm ? workout.reps_warm[i] : -1);
        results.push(workout.tempo_warm ? workout.tempo_warm[i] : -1);
        results.push(workout.sets_warm ? workout.sets_warm[i] : -1);
        nameIdx++;
        i++;
      }
      //results.push("END WARMUP");
    }

    if ("superset_1" in workout) {
      let n = workout.superset_1 ? workout.superset_1.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_1? workout.rest_1[i] : -1);
        console.log(workout.rest_1? workout.rest_1[i] : -1);
        results.push(workout.reps_1? workout.reps_1[i] : -1);
        results.push(workout.tempo_1? workout.tempo_1[i] : -1);
        results.push(workout.sets_1? workout.sets_1[i] : -1);
      }
      nameIdx++;
  }


    if ("superset_2" in workout) {
      let n = workout.superset_2 ? workout.superset_2.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_2? workout.rest_2[i] : -1);
        console.log(workout.rest_2? workout.rest_2[i] : -1);
        results.push(workout.reps_2? workout.reps_2[i] : -1);
        results.push(workout.tempo_2? workout.tempo_2[i] : -1);
        results.push(workout.sets_2? workout.sets_2[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_3" in workout) {
      let n = workout.superset_3 ? workout.superset_3.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_3? workout.rest_3[i] : -1);
        console.log(workout.rest_3? workout.rest_3[i] : -1);
        results.push(workout.reps_3? workout.reps_3[i] : -1);
        results.push(workout.tempo_3? workout.tempo_3[i] : -1);
        results.push(workout.sets_3? workout.sets_3[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_4" in workout) {
      let n = workout.superset_4 ? workout.superset_4.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_4? workout.rest_4[i] : -1);
        console.log(workout.rest_4? workout.rest_4[i] : -1);
        results.push(workout.reps_4? workout.reps_4[i] : -1);
        results.push(workout.tempo_4? workout.tempo_4[i] : -1);
        results.push(workout.sets_4? workout.sets_4[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_5" in workout) {
      let n = workout.superset_5 ? workout.superset_5.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_5? workout.rest_5[i] : -1);
        console.log(workout.rest_5? workout.rest_5[i] : -1);
        results.push(workout.reps_5? workout.reps_5[i] : -1);
        results.push(workout.tempo_5? workout.tempo_5[i] : -1);
        results.push(workout.sets_5? workout.sets_5[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_6" in workout) {
      let n = workout.superset_6 ? workout.superset_6.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_6? workout.rest_6[i] : -1);
        console.log(workout.rest_6? workout.rest_6[i] : -1);
        results.push(workout.reps_6? workout.reps_6[i] : -1);
        results.push(workout.tempo_6? workout.tempo_6[i] : -1);
        results.push(workout.sets_6? workout.sets_6[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_7" in workout) {
      let n = workout.superset_7 ? workout.superset_7.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_7? workout.rest_7[i] : -1);
        console.log(workout.rest_7? workout.rest_7[i] : -1);
        results.push(workout.reps_7? workout.reps_7[i] : -1);
        results.push(workout.tempo_7? workout.tempo_7[i] : -1);
        results.push(workout.sets_7? workout.sets_7[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_8" in workout) {
      let n = workout.superset_8 ? workout.superset_8.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_8? workout.rest_8[i] : -1);
        console.log(workout.rest_8? workout.rest_8[i] : -1);
        results.push(workout.reps_8? workout.reps_8[i] : -1);
        results.push(workout.tempo_8? workout.tempo_8[i] : -1);
        results.push(workout.sets_8? workout.sets_8[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_9" in workout) {
      let n = workout.superset_9 ? workout.superset_9.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_9? workout.rest_9[i] : -1);
        console.log(workout.rest_9? workout.rest_9[i] : -1);
        results.push(workout.reps_9? workout.reps_9[i] : -1);
        results.push(workout.tempo_9? workout.tempo_9[i] : -1);
        results.push(workout.sets_9? workout.sets_9[i] : -1);
      }
      nameIdx++;
    }

    if ("superset_10" in workout) {
      let n = workout.superset_10 ? workout.superset_10.length : -1;

      for (let i = 0; i < n; i++)
      {
        results.push(workout.exercise_names[nameIdx]);
        results.push(workout.rest_10? workout.rest_10[i] : -1);
        console.log(workout.rest_10? workout.rest_10[i] : -1);
        results.push(workout.reps_10? workout.reps_10[i] : -1);
        results.push(workout.tempo_10? workout.tempo_10[i] : -1);
        results.push(workout.sets_10? workout.sets_10[i] : -1);
      }
      nameIdx++;
    }


    console.log(results);
    return results;
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
