import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-departementmanagement',
  templateUrl: './departementmanagement.component.html',
  styleUrl: './departementmanagement.component.scss'
})
export class DepartementmanagementComponent implements OnInit {
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
