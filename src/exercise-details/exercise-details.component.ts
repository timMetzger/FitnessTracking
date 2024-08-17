import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from "@angular/router";
import { switchMap } from 'rxjs/operators'
import {FitnessTracker} from "../services/fitness-tracker";
import {Exercise} from "../exercise";
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-exercise-details',
  standalone: true,
  imports: [],
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.css'
})
export class ExerciseDetailsComponent {
  public exercise: Exercise;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: FitnessTracker
  ){
    this.exercise = {exercise:"NONE"};
    this.getExercise(10);
    // this.exercise$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     this.service.getExerciseById(params.get('id')!))
    //   })
    // )

  }

  getExercise(id:number){
    let req = this.service.getExerciseById(id);
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          this.exercise = data;

        },
        error => console.log(error),
      );
    }
    else{
      this.exercise = req;
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
