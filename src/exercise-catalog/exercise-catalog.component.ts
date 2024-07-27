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

@Component({
  selector: 'app-exercise-catalog',
  standalone: true,
  imports: [AddNewExerciseButton, NgForOf, MatTableModule, MatCheckbox, MatButton],
  templateUrl: './exercise-catalog.component.html',
  styleUrl: './exercise-catalog.component.css',
})
export class ExerciseCatalogComponent {
  private service = inject(ExerciseService)
  dataSource = new MatTableDataSource<Exercise>(this.service.getExerciseList());
  displayedColumns: string[] = ["name","category","group","select"];
  selection = new SelectionModel<Exercise>(true, []);

  hasUpdated(result: boolean){
    if(result){
      this.dataSource.data = this.service.getExerciseList();
    }
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
      console.log(item.name);
    }
  }

  getCategoryLabel(option:number){
    return Category[option];
  }

  getMuscleGroupLabel(option:number){
    return MuscleGroup[option];
  }


}
