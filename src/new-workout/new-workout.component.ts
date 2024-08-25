import {ChangeDetectionStrategy, Component, EventEmitter, Inject, inject, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MatDialogModule,
} from '@angular/material/dialog';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatFormField, MatHint, MatLabel, MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocomplete, MatOption, MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {Exercise} from "../exercise";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {FitnessTracker} from "../services/fitness-tracker";
import {Workout} from "../workout";
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";


export interface BasicEx{
  name:string,
  rest:string,
  reps:string,
  tempo:string,
  sets:string,
  special_notes:string,
}


/**
 * @title Dialog Animations
 */
@Component({
  selector: 'new-workout',
  styleUrl: 'new-workout.component.css',
  templateUrl: 'new-workout-button-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class AddNewWorkoutButton {
  constructor(public dialog: MatDialog) {}

  private service = inject(FitnessTracker);
  @Output() newWorkoutEvent = new EventEmitter<boolean>();

  openDialog(){
    const dialogRef = this.dialog.open(NewWorkoutDialog,{
      width:'80%',
      height:'80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result);
        this.service.addWorkout({name: result.name,type:"N/A",exercise_names:["a"],superset_count:1});
        this.newWorkoutEvent.emit(true);
      }
      this.newWorkoutEvent.emit(false);
    })
  }


}

@Component({
  selector: 'new_workout_dialog',
  styleUrl: 'new_workout_dialog.css',
  templateUrl: 'new-workout.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatGridList,
    MatGridTile,
    MatLabel,
    MatHint,
    MatFormField,
    MatOption,
    MatSelect,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocomplete,
    FormsModule,
    MatAutocompleteModule,
    MatIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWorkoutDialog {
  private service = inject(FitnessTracker);
  public warmup: BasicEx[] = [{  name:"", rest:"", reps:"", tempo:"", sets:"", special_notes:""}]
  public supersets: BasicEx[][] = [[{  name:"", rest:"", reps:"", tempo:"", sets:"", special_notes:""}]]
  public supersetCounts:number[] = [1];
  public warmupExCount:number = 1;
  public myControl = new FormControl("");
  public exList: Exercise[] = [];
  public superset1ExCount = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Workout){
    this.getExercises();
  }

  addSuperset(i:number){
    this.supersetCounts.push(1);
    this.supersets.push([{name:"", rest:"", reps:"", tempo:"", sets:"", special_notes:""}])
  }

  removeSuperset(){
    if(this.supersetCounts.length > 1){
      delete this.supersets[-1];
      delete this.supersetCounts[-1];
    }
  }

  addEx(i:number){
    this.supersets[i].push({name:"", rest:"", reps:"", tempo:"", sets:"", special_notes:""})
    this.supersetCounts[i]++;
  }
  removeEx(i:number){
    if(this.supersetCounts[i] > 1){
      delete this.supersets[i][-1];
      this.supersetCounts[i]--;
    }

  }

  addWarmupEx(){
    this.warmupExCount++;
  }

  removeWarmupEx(){
    if(this.warmupExCount > 1){
      delete this.warmup[-1];
      this.warmupExCount--;
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
          this.exList = data;
          this.service.setExerciseList(data)

        },
        error => console.log(error),
      );
    }
    else{
      this.exList = req;
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
