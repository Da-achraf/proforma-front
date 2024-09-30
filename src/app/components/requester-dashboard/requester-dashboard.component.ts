import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-requester-dashboard',
  templateUrl: './requester-dashboard.component.html',
  styleUrl: './requester-dashboard.component.css'
})
export class RequesterDashboardComponent implements OnInit {
  constructor(private auth: AuthService){}
  ngOnInit(){}
  logout(){
    this.auth.SignOut();
  }
 
}
