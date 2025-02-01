import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../shared/services/toaster.service';

/**
 * A guard to protect routes that require authentication.
 * This guard ensures that only authenticated users can access certain routes.
 * If the user is not logged in, they will be redirected to the login page
 * and shown a warning message.
 *
 * @returns {boolean}
 * - `true`: If the user is authenticated, allowing access to the route.
 * - `false`: If the user is not authenticated, blocking access and redirecting to the login page.
 */
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Check if the user is logged in using the AuthService
  const isLoggedIn = inject(AuthService).IsLogedIn();

  // Allow access to the route
  if (isLoggedIn) {
    return true;
  }

  // If the user is not logged in, redirect them to the login page
  // with the original visisted url as query param
  inject(Router).navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  inject(ToasterService).showWarning('Please Login First');

  // Block access to the route
  return false;
};
