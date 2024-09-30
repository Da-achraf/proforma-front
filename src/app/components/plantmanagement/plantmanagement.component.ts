import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-plantmanagement',
  templateUrl: './plantmanagement.component.html',
  styleUrl: './plantmanagement.component.scss'
})
export class PlantmanagementComponent implements OnInit {
  constructor(private auth: AuthService){}
  ngOnInit(){}
  logout(){
    this.auth.SignOut();
  }
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
