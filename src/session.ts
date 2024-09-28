import {WorkoutResults} from "./workoutResults";

export interface Session{
  id:number,
  completed?:Date,
  workout_id:number,
  workout_results:WorkoutResults,
}
