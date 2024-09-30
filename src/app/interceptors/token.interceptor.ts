import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';


@Injectable()
export class tokenInterceptor implements HttpInterceptor{
  constructor(private auth: AuthService, private router: Router, private toast: NgToastService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const myToken =this.auth.getToken();
    if(myToken){
      req = req.clone({ setHeaders: { Authorization: `Bearer ${myToken}` } });
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toast.warning({
            detail: "Warning",
            summary: "Token is expired, please log in again.",
            duration: 5000
          });
          this.router.navigateByUrl("/login");
        }
        // Vous pouvez également gérer d'autres statuts d'erreur ici
        return throwError(() => new Error(`An error occurred: ${err.message}`));
      })
    );
  }
}