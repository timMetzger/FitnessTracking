import {BasicEx} from "./exercise";

export interface Workout {
  id ?: number;
  name : string,
  type : string,
  created_by:string;
  created_on?: Date;
  last_completed ?: Date;
  warmup:[BasicEx];
  supersets:[BasicEx[]]
}
