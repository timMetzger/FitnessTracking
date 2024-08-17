import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { ExerciseCatalogComponent } from "../exercise-catalog/exercise-catalog.component";
import {ExerciseDetailsComponent} from "../exercise-details/exercise-details.component";
import {WorkoutCatalogComponent} from "../workout-catalog/workout-catalog.component";


@Component({
  selector: 'app-root',
  standalone: true,
    imports: [CommonModule, RouterOutlet, ExerciseCatalogComponent, ExerciseDetailsComponent, WorkoutCatalogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fitness';
}
