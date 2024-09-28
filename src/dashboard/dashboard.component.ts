import {AfterViewInit, ChangeDetectionStrategy, Component, inject, Inject, ViewChild} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatGridList, MatGridListModule, MatGridTile} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {FullCalendarComponent, FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions, DateSpanApi} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogModule,
  MatDialogTitle
} from "@angular/material/dialog";
import {FitnessTracker} from "../services/fitness-tracker";
import {Workout} from "../workout";
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatAutocomplete, MatAutocompleteModule, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatSelect} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FullCalendarModule,
  ]
})
export class DashboardComponent implements AfterViewInit{
  @ViewChild('calendar') calendarComponent !: FullCalendarComponent
  private calendarAPI: any;
  showContextMenu: boolean = false;
  contextMenuPosition: {x:number,y:number} = {x:0,y:0};
  constructor(private router: Router,public dialog: MatDialog,private service: FitnessTracker) {
    this.getScheduledEvents()
  }

  ngAfterViewInit(){
    this.calendarAPI = this.calendarComponent.getApi();
  }


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins:[dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    selectable:true,
    selectAllow: (arg) => this.restrictSelection(arg),
    editable:true,
    firstDay:1,
    events: [
      // { title: 'event 1', date: '2024-09-01', id: "1",extendedProps:{workoutId:"1"}},
      // { title: 'event 2', date: '2024-09-17', id: "2",extendedProps:{workoutId:"2"}}
    ],
    eventClick: (arg) => this.handleEventClick(arg),
  };


  getScheduledEvents(){
    let req = this.service.getScheduledEvents();
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          console.log(data);
          this.calendarOptions.events = data;
        },
        error => console.log(error),
      );
    }
  }


  handleDateClick(arg:any){//TODO: need to configure workout scheduling uhhh..
    if(arg.jsEvent.ctrlKey){
      const dialogRef = this.dialog.open(AddEventDialog,{
        width:'75%',
        height:'75%'});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          console.log(result);
        }
      })
    }
  }

  handleOption(option:String){
    console.log(option);
    this.showContextMenu = false;
  }

  handleEventClick(info:any){
    info.jsEvent.preventDefault();

    let req = this.service.getWorkoutById(info.event.extendedProps.workoutId);
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          const dialogRef = this.dialog.open(CalendarEventDialog,{
            width:'75%',
            height:'75%',
            data:data});
          dialogRef.afterClosed().subscribe(result => {
            if(result) {
              console.log(result);
              this.router.navigate(['/session-recorder',info.event.id,info.event.extendedProps.workoutId]);
            }
          })
        },
        error => console.log(error),
      );
    }


  }

  restrictSelection(e: DateSpanApi){
    if(e.end.getTime() / 1000 - e.start.getTime() / 1000 <= 86400) {
      return true;
    }
    return false;
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
@Component({
  selector: 'calendar_event_dialog',
  styleUrl: 'calendar-event-dialog.component.css',
  templateUrl: 'calendar-event-dialog.component.html',
  standalone:true,
  imports:[
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatGridList,
    MatGridTile,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEventDialog{
  public workout:Workout;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    console.log(data);
    this.workout = data;
  }
}

@Component({
  selector: 'add_event_dialog',
  styleUrl: 'add-event-dialog.component.css',
  templateUrl: 'add-event-dialog.component.html',
  standalone:true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatOption,
    MatSelect,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocomplete,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddEventDialog{
  private service = inject(FitnessTracker);
  public workoutId:number;
  public wkList: Workout[] = [];
  public filteredOptions: Workout[] = this.wkList;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.workoutId = 0;
    this.getWorkouts();
  }

  doFilter(search:string){
    search = search + "";
    if(!search){
      this.filteredOptions = this.wkList;
    }
    else{
      this.filteredOptions = this.wkList.filter(option => option.name.toLowerCase().includes(search))
    }
  }

  selectedWorkout(id:number){
    this.workoutId = id;
  }

  getWorkouts(){
    let req = this.service.getWorkoutList();

    // Request can either be an http request observable or the request may already be stored
    if(req instanceof Observable){
      req.pipe(
        retry(3),
        catchError(this.handleHttpError),
      ).subscribe(
        data => {
          console.log(data);
          this.wkList = data;
          this.filteredOptions = data;

        },
        error => console.log(error),
      );
    }
    else{
      this.wkList = req;
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
