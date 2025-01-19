import { computed, inject, Injectable, signal } from '@angular/core';
import { RequestModel } from '../../models/request.model';
import { RequestStatus } from '../../models/requeststatus.model';
import { SidenavItem } from '../../models/sidenav-item.model';
import { RoleEnum, User } from '../../models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  // Injected dependencies
  auth = inject(AuthService);
  userStore = inject(UserStoreService);
  userService = inject(UserService);

  // Signals and computed values
  requests = signal<RequestModel[]>([]);
  users = signal<User[]>([]);
  loggedInUserRole = this.userStore.userRole;

  inActivatedAcountsCount = computed(() => {
    const users = this.users();
    return users.filter((u) => !u.role).length;
  });

  pendingRequestsCount = computed(() => {
    const requests = this.requests();
    const role = this.loggedInUserRole();

    if (!requests || !role) return 0;

    return this.getPendingRequestsCountByRole(requests, role as RoleEnum);
  });

  // Methods
  getMenuItemsBasedOnRole(allItems: any[], role: RoleEnum): SidenavItem[] {
    return allItems.filter((item: SidenavItem) => {
      return item.roles?.includes(role) || item.roles?.includes(RoleEnum.ALL);
    });
  }

  private getPendingRequestsCountByRole(
    requests: RequestModel[],
    role: RoleEnum
  ): number {
    switch (role) {
      case RoleEnum.FINANCE_APPROVER:
        return requests.filter(
          (r) => r.status === RequestStatus.PendingInFinance
        ).length;
      case RoleEnum.TRADECOMPLIANCE_APPROVER:
        return requests.filter(
          (r) => r.status === RequestStatus.PendingInTradCompliance
        ).length;
      case RoleEnum.WAREHOUSE_APPROVER:
        return requests.filter((r) => r.status === RequestStatus.InShipping)
          .length;
      default:
        return 0;
    }
  }
}
