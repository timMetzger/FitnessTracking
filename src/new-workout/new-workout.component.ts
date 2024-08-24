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
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {Exercise} from "../exercise";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {FitnessTracker} from "../services/fitness-tracker";
import {Category, MuscleGroup} from "../exercise-enums";
import {Workout} from "../workout";
import {CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";


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
        CdkDropList
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWorkoutDialog {
  private service = inject(FitnessTracker);
  public pendingExercises: BasicEx[] = [{name:"press",rest:"",sets:"",reps:"",tempo:"",special_notes:""}];
  public supersets: BasicEx[][] = [];
  public supersetCount:number = 1;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Workout){}

  addSuperset(){
    this.supersetCount++;
  }

  drop(event:any){
    console.log(event);
  }

}
