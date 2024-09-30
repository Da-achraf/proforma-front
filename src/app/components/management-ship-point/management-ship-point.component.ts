import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-management-ship-point',
  templateUrl: './management-ship-point.component.html',
  styleUrl: './management-ship-point.component.scss'
})
export class ManagementShipPointComponent implements OnInit {
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
