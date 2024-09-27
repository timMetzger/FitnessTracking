import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Workout} from "../workout";
import {FitnessTracker} from "../services/fitness-tracker";
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-session-recorder',
  standalone: true,
  imports: [],
  templateUrl: './session-recorder.component.html',
  styleUrl: './session-recorder.component.css'
})
export class SessionRecorderComponent implements OnInit{
  public workout: Workout;
  public sessionId: number;
  constructor(private route: ActivatedRoute,
              private service: FitnessTracker) {
    this.sessionId = -1;
    this.workout = {} as Workout
  }

  ngOnInit(){

    (this.route.params.subscribe(params => {
      this.sessionId = params['id'] as number;
      this.getWorkout(this.sessionId)

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
          console.log(this.workout);
        },
        error => console.log(error),
      );
    }
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
