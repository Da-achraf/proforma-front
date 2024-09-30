import { Injectable } from "@angular/core";
import { CanActivate} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private loginAuth: AuthService,private router: Router,private toast: NgToastService){}
  canActivate(): boolean{
    if(this.loginAuth.IsLogedIn()){
      return true;
    }else{
      this.toast.error({detail:"ERROR", summary: "PLease Login First"});
      this.router.navigateByUrl('login');
      return false;
    }
    
  }
}