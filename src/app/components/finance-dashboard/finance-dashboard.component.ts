import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrl: './finance-dashboard.component.css'
})
export class FinanceDashboardComponent implements OnInit {
  constructor(private auth: AuthService){}
  ngOnInit(){}
  logout(){
    this.auth.SignOut();
  }
}
