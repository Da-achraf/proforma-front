import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { delay, of, tap } from 'rxjs';
import { RequestStatus } from '../../core/models/requeststatus.model';
import { RoleEnum } from '../../core/models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { StatusFilterOptions } from './data';

@Injectable({ providedIn: 'root' })
export class RequestStatusTabFilterService {
  private _loading = signal(false);
  loading = this._loading.asReadonly();

  /**
   * @description
   * If the implementation of _options changes in the future,
   * we exposes the public signal options so it will be decoupled
   * from the implementation.
   *
   */
  private options$ = of(StatusFilterOptions).pipe(
    tap(() => this._loading.set(true)),
    delay(900),
    tap(() => this._loading.set(false))
  );
  options = toSignal(this.options$, { initialValue: [] });

  private readonly userRole = inject(AuthService).getRoleFromToken();
  initialSelected = computed(() => {
    this.options();

    switch (this.userRole) {
      case RoleEnum.FINANCE_APPROVER:
        return RequestStatus.PendingInFinance.toString();

      case RoleEnum.TRADECOMPLIANCE_APPROVER:
        return RequestStatus.PendingInTradCompliance.toString();

      case RoleEnum.WAREHOUSE_APPROVER:
        return RequestStatus.InShipping.toString();
      default:
        return 'all';
    }
  });
}
