import {ChangeDetectionStrategy, Component, EventEmitter, Inject, inject, Input, OnInit, Output} from '@angular/core';
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
import {Exercise, BasicEx} from "../exercise";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {FitnessTracker} from "../services/fitness-tracker";
import {Workout} from "../workout";
import {catchError, debounceTime, Observable, retry, startWith, Subject, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";
import {map} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";
import {ex} from "@fullcalendar/core/internal-common";





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
      width:'90%',
      height:'90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.service.addWorkout(result);
        this.newWorkoutEvent.emit(result);
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
    MatIcon,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWorkoutDialog{
  private service = inject(FitnessTracker);
  public name: string = "";
  public createdBy: string = ""
  public type:string = ""
  public warmup: BasicEx[] = [{  name:"", id: -1, rest:"", reps:"", tempo:"", sets:"", special_notes:""}]
  public supersets: BasicEx[][] = [[{  name:"", id: -1, rest:"", reps:"", tempo:"", sets:"", special_notes:""}]]
  public supersetCounts:number[] = [1];
  public warmupExCount:number = 1;
  public exList: Exercise[] = [];

  public filteredOptions: Exercise[] = this.exList;



  doFilter(search:string){
    search = search + "";
    if(!search){
      this.filteredOptions = this.exList;
    }
    else{
      this.filteredOptions = this.exList.filter(option => option.exercise.toLowerCase().includes(search))
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: Workout){
    this.getExercises();
  }

  hasSelectedWarmupEx(selected:boolean,exIdx:number,optionID:number){
    if(selected){
      this.filteredOptions = this.exList;
      this.warmup[exIdx].id = optionID;
    }
  }
  hasSelectedSupersetEx(selected:boolean,superset:number,exIdx:number,optionID:number){
    if(selected){
      this.filteredOptions = this.exList;
      this.supersets[superset][exIdx].id = optionID;
    }
  }
  updateWarmup(e:string,idx:number){
    this.warmup[idx].name = e;
  }
  updateSupersetEx(e:string,idx:number,set:number){
    this.supersets[set][idx].name = e;
  }

  removeSuperset(){
    if(this.supersetCounts.length > 1){
      this.supersets.pop();
      this.supersetCounts.pop();
    }
  }

  addEx(i:number){
    this.supersets[i].push({  name:"", id: -1, rest:"", reps:"", tempo:"", sets:"", special_notes:""})
    this.supersetCounts[i]++;
  }
  removeEx(i:number){
    console.log(this.supersetCounts);
    if(this.supersetCounts[i] > 1){
      this.supersets[i].pop();
      this.supersetCounts[i]--;
    }
    console.log(this.supersetCounts);

  }

  addSuperset(){
    this.supersetCounts.push(1);
    this.supersets.push([{  name:"", id: -1, rest:"", reps:"", tempo:"", sets:"", special_notes:""}])
  }

  addWarmupEx(){
    this.warmup.push({  name:"", id: -1, rest:"", reps:"", tempo:"", sets:"", special_notes:""});
    this.warmupExCount++;
  }

  removeWarmupEx(){
    if(this.warmupExCount > 1){
      this.warmup.pop();
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
          this.filteredOptions = data;

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
