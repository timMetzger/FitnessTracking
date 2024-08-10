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
import {ExerciseService} from "../services/exercise.service";
import {Category, MuscleGroup} from "../exercise-enums";

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'new-exercise',
  styleUrl: 'new-exercise.component.css',
  templateUrl: 'new-exercise-button-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class AddNewExerciseButton {
  constructor(public dialog: MatDialog) {}

  private service = inject(ExerciseService);
  @Output() newExerciseEvent = new EventEmitter<boolean>();

  openDialog(){
    const dialogRef = this.dialog.open(NewExerciseDialog,{});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result);
        this.service.addExercise({exercise: result.name});
        this.newExerciseEvent.emit(true);
      }
      this.newExerciseEvent.emit(false);
    })
  }


}

@Component({
  selector: 'new_exercise_dialog',
  templateUrl: 'new-exercise.component.html',
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
    MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewExerciseDialog {
  private service = inject(ExerciseService);
  categories: number[] = this.service.getExerciseCategories();
  muscleGroups: number[] = this.service.getExerciseMuscleGroups();
  constructor(@Inject(MAT_DIALOG_DATA) public data: Exercise){}

  getCategoryLabel(option:number){
    return Category[option];
  }

  getMuscleGroupLabel(option:number){
    return MuscleGroup[option];
  }


}
