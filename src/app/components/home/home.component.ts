import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    SideNavComponent,
    HeaderComponent,
    DashboardComponent,
    RouterOutlet,
  ],
})
export class HomeComponent implements OnInit {
  constructor(private auth: AuthService) {}
  ngOnInit() {}

  logout() {
    this.auth.SignOut();
  }

  sideBarOpen = signal(false);

  sideBarToggler() {
    this.sideBarOpen.update((val) => !val);
  }
}
