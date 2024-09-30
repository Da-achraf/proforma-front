import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-warehouse-dashboard',
  templateUrl: './warehouse-dashboard.component.html',
  styleUrl: './warehouse-dashboard.component.css'
})
export class WarehouseDashboardComponent {
  constructor(private auth: AuthService){}
  ngOnInit(){}
  logout(){
    this.auth.SignOut();
  }
}
