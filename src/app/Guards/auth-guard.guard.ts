import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleEnum } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class authGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles'];
    const userRole = this.authService.getRoleFromToken();
    
    console.log('route = ', route)
    console.log('userRole = ', userRole)
    console.log('expectedRoles = ', expectedRoles.includes(RoleEnum.ALL))

    if (!userRole || (!expectedRoles.includes(userRole) && !expectedRoles.includes(RoleEnum.ALL))) {
      console.log('Blocked by auth guard.. redirecting to login page')
      this.router.navigate(['/login']); // Redirection vers une page non autorisée ou de connexion
      return false;
    }

    return true;
  }
}
