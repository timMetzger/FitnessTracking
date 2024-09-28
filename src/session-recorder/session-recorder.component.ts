import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Workout} from "../workout";
import {FitnessTracker} from "../services/fitness-tracker";
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {SetEntry, WorkoutResults} from "../workoutResults";
import {BasicEx} from "../exercise";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {Session} from "../session";

@Component({
  selector: 'app-session-recorder',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatInput,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './session-recorder.component.html',
  styleUrl: './session-recorder.component.css'
})
export class SessionRecorderComponent implements OnInit{
  public workout: Workout;
  public sessionId: number;
  public workoutId: number;
  public workoutResults: WorkoutResults;
  public resultIndex:number;
  public session:Session;
  constructor(private route: ActivatedRoute,
              private service: FitnessTracker) {
    this.sessionId = -1;
    this.workoutId = -1;
    this.workout = {} as Workout;
    this.workoutResults = {"results":[]} as WorkoutResults;
    this.session = {} as Session;
    this.resultIndex = 0;
  }

  ngOnInit(){

    (this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'] as number;
      this.workoutId = params['workoutId'] as number;
      this.getWorkout(this.workoutId);
      this.getSession(this.sessionId);
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
        },
        error => console.log(error),
      );
    }
  }
  getSetCountInt(setString:string){
    if (setString.length > 1){
      return parseInt(setString[-1]);
    }
    else{
      return parseInt(setString[0]);
    }
  }

  getSession(id:number){
    let req = this.service.getSessionById(id);
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          console.log(data);
          this.session = data;
          this.workoutResults = this.session.workout_results;
        },
        error => console.log(error),
      );
    }
  }

  buildWorkoutResultsObjects(){
    let tempResults:SetEntry[] = [];
    this.workout.warmup.forEach(function (ex:BasicEx){
      let setCount;
      if (ex.sets.length > 1){
        setCount = parseInt(ex.sets[-1]);
      }
      else{
        setCount = parseInt(ex.sets[0]);
      }
      let sets:number[] = new Array<number>(setCount).fill(0);
      let entry:SetEntry = {"weight":sets,"reps":sets}
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
    console.log(tempResults);
    this.workoutResults.results = tempResults;
  }

  saveSession(){
    this.service.saveSession({id:this.sessionId,workout_id:this.workoutId,workout_results:this.workoutResults});
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
