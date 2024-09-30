import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tradcompliance-dashboard',
  templateUrl: './tradcompliance-dashboard.component.html',
  styleUrl: './tradcompliance-dashboard.component.css'
})
export class TradcomplianceDashboardComponent {
  constructor(private auth: AuthService){}
  ngOnInit(){}
  logout(){
    this.auth.SignOut();
  }
}
