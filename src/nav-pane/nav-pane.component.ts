import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  ActivatedRoute,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  RouterStateSnapshot,
  ROUTES,
  Routes,
} from "@angular/router";
import { Title } from "@angular/platform-browser";


@Component({
  selector: 'app-nav-pane',
  templateUrl: './nav-pane.component.html',
  styleUrl: './nav-pane.component.css',
  standalone: true,
  providers:[Title],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLinkActive,
    RouterModule,
  ]
})


export class NavPaneComponent {
  private breakpointObserver = inject(BreakpointObserver);
  constructor(private activatedRoute: ActivatedRoute, public titleService:Title) {
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
