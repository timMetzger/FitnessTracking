import { Routes } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";
import {WorkoutCatalogComponent} from "../workout-catalog/workout-catalog.component";
import {ExerciseCatalogComponent} from "../exercise-catalog/exercise-catalog.component";
import {SessionRecorderComponent} from "../session-recorder/session-recorder.component";

export const routes: Routes = [
  {path:"",component:DashboardComponent,title:"Fitness Dashboard"},
  {path:"workout-catalog",component:WorkoutCatalogComponent,title:"Workout Catalog"},
  {path:"exercise-catalog",component:ExerciseCatalogComponent,title:"Exercise Catalog"},
  {path:"session-recorder/:sessionId/:workoutId",component:SessionRecorderComponent,title:"Session Recorder"},

];
