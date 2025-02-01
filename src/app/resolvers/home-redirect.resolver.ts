import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { RoleEnum } from '../models/user/user.model';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../shared/services/toaster.service';

/**
 * A resolver to handle role-based redirection for the default route under `home`.
 * This resolver is used on the default child route (`path: ''`) of the `home` route.
 * It checks the user's role and redirects them to the appropriate route:
 * - Admins (`RoleEnum.ADMIN`) are redirected to `/home/dashboard`.
 * - Other roles are redirected to `/home/requests`.
 * If the user is not authenticated or an error occurs, they are redirected to the login page.
 *
 * This resolver ensures that users are automatically directed to the correct route
 * when they access the default `home` route (`/home`).
 *
 * **Note**: This resolver can be removed once other roles (non-admins) have their own
 * dashboard page with role-specific content. At that point, the default route (`/home`)
 * can directly load the appropriate dashboard for each role without requiring a redirect.
 *
 * @returns {boolean}
 * - Always returns `false` to prevent the original route (`/home`) from being activated.
 */
export const HomeRedirectResolver: ResolveFn<boolean> = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    // Get the user ID from the decoded token
    const userId = authService.decodedToken()?.id;

    // If the user ID is not found, throw an error
    if (!userId) {
      throw new Error('User ID not found in token. Please log in again.');
    }

    // Fetch the user data using the user ID
    const user = await authService.getUserById(userId);

    // If the user data could not be fetched, throw an error
    if (!user) {
      throw new Error('User data could not be fetched.');
    }

    // Redirect the user based on their role
    if (user.role === RoleEnum.ADMIN) {
      router.navigate(['/home/dashboard']); // Admins are redirected to the dashboard
    } else {
      router.navigate(['/home/requests']); // Other roles are redirected to the requests page
    }
  } catch (error) {
    // If an error occurs (e.g., user not authenticated or API failure), redirect to the login page
    router.navigate(['/login']);

    // Show an error message to the user using the ToasterService
    inject(ToasterService).showError('You need to login first');
  } finally {
    // Always return false to prevent the original route (`/home`) from being activated
    return false;
  }
};
