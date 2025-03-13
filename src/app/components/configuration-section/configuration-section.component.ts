import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { ConfigurationHomeComponent } from '../configuration-home/configuration-home.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-configuration-section',
  templateUrl: './configuration-section.component.html',
  styleUrl: './configuration-section.component.scss',
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    SideNavComponent,
    ConfigurationHomeComponent,
    HeaderComponent,
    RouterOutlet,
  ],
})
export class ConfigurationSectionComponent {
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
