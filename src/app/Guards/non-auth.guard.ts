import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../shared/services/toaster.service';

/**
 * A guard to prevent authenticated users from accessing routes that are only for non-authenticated users.
 * For example, this guard can be used on the login or signup routes to redirect authenticated users
 * to the home page.
 *
 * @returns {boolean}
 * - `true`: If the user is **not** authenticated, allowing access to the route.
 * - `false`: If the user is authenticated, blocking access and redirecting to the home page.
 */
export const NonAuthGuard: CanActivateFn = () => {
  // Check if the user is logged in using the AuthService
  const isLoggedIn = inject(AuthService).IsLogedIn();

  // Allow access to the route
  if (!isLoggedIn) {
    return true;
  }

  // If the user is logged in, show a warning message using the ToasterService
  inject(ToasterService).showWarning('You need to logout first.');

  // Redirect the user to the home page
  inject(Router).navigateByUrl('/home');

  // Block access to the route
  return false;
};