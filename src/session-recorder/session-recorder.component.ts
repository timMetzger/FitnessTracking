import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Workout} from "../workout";
import {FitnessTracker} from "../services/fitness-tracker";
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {SetEntry, WorkoutResults} from "../workoutResults";
import {BasicEx} from "../exercise";

@Component({
  selector: 'app-session-recorder',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './session-recorder.component.html',
  styleUrl: './session-recorder.component.css'
})
export class SessionRecorderComponent implements OnInit{
  public workout: Workout;
  public sessionId: number;
  public workoutId: number;
  public workoutResults: WorkoutResults;
  public results: any;
  constructor(private route: ActivatedRoute,
              private service: FitnessTracker) {
    this.sessionId = -1;
    this.workoutId = -1;
    this.workout = {} as Workout;
    this.workoutResults = {} as WorkoutResults;
    this.results = [];
  }

  ngOnInit(){

    (this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'] as number;
      this.workoutId = params['workoutId'] as number;
      this.getWorkout(this.workoutId)
    }))
  }

  getWorkout(id:number){
    let req = this.service.getWorkoutById(id);
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          this.workout = data;
          this.configureResults();
        },
        error => console.log(error),
      );
    }
  }

  configureResults(){
    let tempResults = [];
    this.workout.warmup.forEach(function (ex:BasicEx){
      let setCount = parseInt(ex.sets[0]);
      let sets = new Array<number>(setCount).fill(0);
      let entry = {"weight":sets,"reps":sets}
      tempResults.push(entry);
    })

    this.workout.supersets.forEach(function (exGroup:BasicEx[]){
      exGroup.forEach(function(ex:BasicEx){
        let setCount = parseInt(ex.sets[0]);
        let sets = new Array<number>(setCount).fill(0);
        let entry = {"weight":sets,"reps":sets}
        tempResults.push(entry);
      })
    })

    //this.results = tempResults; //TODO: have to create a data structure for storing the results of the workout
    console.log(tempResults);
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
