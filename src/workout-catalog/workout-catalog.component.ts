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
import {MatGridList, MatGridTile, MatGridListModule} from "@angular/material/grid-list";
import {Workout} from "../workout";
import {AddNewWorkoutButton} from "../new-workout/new-workout.component";
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-workout-catalog',
  standalone: true,
  imports: [AddNewWorkoutButton, NgForOf, MatTableModule, MatCheckbox, MatButton, MatFormFieldModule, MatInputModule, MatGridList, MatGridTile, MatGridListModule],
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
  public supersetColor = "warmup-block";

  private service = inject(FitnessTracker)

  dataSource = new MatTableDataSource<Workout>([]);
  displayedColumns: string[] = ["name","type","last_completed","createdBy","createdOn"];


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

  public setColor(s:string){
    if(s == "WARMUP" || s == "END WARMUP"){
      this.supersetColor = "#fd934d";
    }
    else{
      this.supersetColor = "#ffb888";
    }
  }

  // TODO: if user clicked on a exercise name take them to the exercise page
  public highlight(clicked:string){
    console.log(clicked);
    if(clicked){
      if(this.expandedWorkout){
        let workout: Workout = this.expandedWorkout as Workout;
        let idx = workout.exercise_names.indexOf(clicked.trim());
      }
    }
  }

  public displayWorkout(workout:Workout) {
    return this.service.workoutIterativeForm(workout);
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
