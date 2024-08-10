import {Component, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {Exercise} from "../exercise";
import {AddNewExerciseButton} from "../new-exercise/new-exercise.component";
import {NgForOf} from "@angular/common";
import { ExerciseService } from "../services/exercise.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton} from "@angular/material/button";
import {Category, MuscleGroup} from "../exercise-enums";
import {catchError, map, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-exercise-catalog',
  standalone: true,
  imports: [AddNewExerciseButton, NgForOf, MatTableModule, MatCheckbox, MatButton],
  templateUrl: './exercise-catalog.component.html',
  styleUrl: './exercise-catalog.component.css',
})
export class ExerciseCatalogComponent {
  constructor() {
    this.getExercises();
  }

  private service = inject(ExerciseService)
  private exerciseList:Exercise[] = [];
  dataSource = new MatTableDataSource<Exercise>([]);
  displayedColumns: string[] = ["name","primary","secondary","shortVideo"];
  selection = new SelectionModel<Exercise>(true, []);


  hasUpdated(result: boolean){
    if(result){
      this.getExercises();
    }
  }

  getExercises(){
    this.service.getExerciseList().pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          console.log(data);
          this.dataSource.data = data;
        },
        error => console.log(error),
      );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteSelected(){
    for(let item of this.selection.selected){
      console.log(item.exercise);
    }
  }

  getCategoryLabel(option:number){
    return Category[option];
  }

  getMuscleGroupLabel(option:number){
    return MuscleGroup[option];
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
