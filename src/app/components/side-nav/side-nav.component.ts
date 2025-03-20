import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { allMenuItems } from '../../core/models/sidenav-item.model';
import { RoleEnum } from '../../core/models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { SideNavService } from '../../shared/services/side-nav.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
  imports: [RouterLink, RouterLinkActive],
})
export class SideNavComponent {
  // Injected dependencies
  sideNavService = inject(SideNavService);
  auth = inject(AuthService);

  // Signals and computed values
  items = signal(
    this.sideNavService.getMenuItemsBasedOnRole(
      allMenuItems,
      this.auth.getRoleFromToken() as RoleEnum,
    ),
  );
}
