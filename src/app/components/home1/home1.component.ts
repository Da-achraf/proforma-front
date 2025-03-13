import { Component, inject } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrl: './home1.component.scss',
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    SideNavComponent,
    HeaderComponent,
    RouterOutlet,
  ],
})
export class Home1Component {
  auth = inject(AuthService);

  logout() {
    this.auth.SignOut();
  }
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
