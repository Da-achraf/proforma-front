import { Observable } from "rxjs";
import { toSignal } from '@angular/core/rxjs-interop'
import { RequestModel } from "../../../models/request.model";
import { LoggedInUser, RoleEnum, User } from "../../../models/user/user.model";
import { AdminRequestStrategy } from "./admin-requests-strategy.service";
import { RequesterRequestStrategy } from "./requester-requests-strategy.service";
import { ByPlantsRequestStrategy } from "./by-plants-requests-strategy.service";
import { inject, Injectable, Signal } from "@angular/core";
import { IRequestStrategy } from "./requests-strategies";
import { RequestService } from "../../../services/request.service";


@Injectable({
  providedIn: 'root'
})
export class RequestStrategyFactory {

  requestService = inject(RequestService)

  private getStrategy(role: RoleEnum): IRequestStrategy {
    switch (role) {
        case RoleEnum.ADMIN:
            return new AdminRequestStrategy(this.requestService);
        case RoleEnum.REQUESTER:
            return new RequesterRequestStrategy(this.requestService);
        case RoleEnum.FINANCE_APPROVER:
        case RoleEnum.TRADECOMPLIANCE_APPROVER:
        case RoleEnum.WAREHOUSE_APPROVER:
            return new ByPlantsRequestStrategy(this.requestService);
        default:
            throw new Error('Role not supported');
    }
  }
  
  getRequests(user: User): Observable<RequestModel[]> {
    const strategy = this.getStrategy(user.role as RoleEnum)
    return strategy.getRequests(user)
  }
}