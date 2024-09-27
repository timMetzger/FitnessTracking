import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {AsyncPipe, CommonModule} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {FullCalendarComponent, FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions, DateSpanApi} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"
import { Router } from "@angular/router";

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

  constructor(private router: Router) {}

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
      { title: 'event 1', date: '2024-09-01', id: "1"},
      { title: 'event 2', date: '2024-09-17', id: "2"}
    ],
    eventClick: (arg) => this.handleEventClick(arg)
  };

  handleDateClick(arg:any){
  }

  handleEventClick(info:any){
    info.jsEvent.preventDefault();
    alert("Workout: " + info.event.title);//TODO: this needs to be a dialog populated with the workout at a glance

    this.router.navigate(['/session-recorder',info.event.id]);
  }

  restrictSelection(e: DateSpanApi){
    if(e.end.getTime() / 1000 - e.start.getTime() / 1000 <= 86400) {
      return true;
    }
    return false;
  }


}
