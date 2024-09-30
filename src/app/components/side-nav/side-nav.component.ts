import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu, SideNavService } from '../../shared/services/side-nav.service';
import { AuthService } from '../../services/auth.service';
import { RoleEnum } from '../../models/user/user.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  sideNavService = inject(SideNavService)
  auth = inject(AuthService)

  items: Menu[] = this.sideNavService.getMenuItemsBaseOnRole(this.auth.getRoleFromToken() as RoleEnum)

  userName = this.auth.getFullNameFromToken()
}
