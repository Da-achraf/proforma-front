import { Component, inject, signal } from '@angular/core';
import { RoleEnum } from '../../models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { SideNavService } from '../../shared/services/side-nav.service';
import { allMenuItems } from '../../models/sidenav-item.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  // Injected dependencies
  sideNavService = inject(SideNavService)
  auth = inject(AuthService)

  // Signals and computed values
  items = signal(this.sideNavService.getMenuItemsBasedOnRole(
    allMenuItems,
    this.auth.getRoleFromToken() as RoleEnum
  ))
}
