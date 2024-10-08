import {Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Exercise} from "../exercise";
import {AddNewExerciseButton} from "../new-exercise/new-exercise.component";
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

@Component({
  selector: 'app-exercise-catalog',
  standalone: true,
  imports: [AddNewExerciseButton, NgForOf, MatTableModule, MatCheckbox, MatButton, MatFormFieldModule, MatInputModule, MatGridList, MatGridTile],
  templateUrl: './exercise-catalog.component.html',
  styleUrl: './exercise-catalog.component.css',
})
export class ExerciseCatalogComponent implements OnDestroy{
  private searchInput = new Subject<string>();
  private readonly debounceTimeMs = 250;

  private service = inject(FitnessTracker)

  dataSource = new MatTableDataSource<Exercise>([]);
  displayedColumns: string[] = ["name","primary","secondary","shortVideo"];
  selection = new SelectionModel<Exercise>(true, []);

  constructor() {
    this.getExercises();

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
      this.getExercises();
    }
  }

  getExercises(){
    let req = this.service.getExerciseList();

    // Request can either be an http request observable or the request may already be stored
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          this.dataSource.data = data;
          this.service.setExerciseList(data)

        },
        error => console.log(error),
      );
    }
    else{
      this.dataSource.data = req;
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
