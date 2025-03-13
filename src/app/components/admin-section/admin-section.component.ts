import { Component } from '@angular/core';
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
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrl: './admin-section.component.scss',
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    SideNavComponent,
    HeaderComponent,
    DashboardComponent,
    RouterOutlet,
  ],
})
export class AdminSectionComponent {
  constructor(private auth: AuthService) {}
  ngOnInit() {}
  logout() {
    this.auth.SignOut();
  }
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
