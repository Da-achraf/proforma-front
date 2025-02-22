import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestModel } from "../../../models/request.model";
import { RoleEnum, User } from "../../../models/user/user.model";
import { RequestService } from "../../../services/request.service";
import { AdminRequestStrategy } from "./admin-requests-strategy.service";
import { ByShipPointRequestStrategy } from "./by-shippoints-requests-strategy.service";
import { RequesterRequestStrategy } from "./requester-requests-strategy.service";
import { IRequestStrategy } from "./requests-strategies";


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
            return new ByShipPointRequestStrategy(this.requestService);
        default:
            throw new Error('Role not supported');
    }
  }
  
  getRequests(user: User): Observable<RequestModel[]> {
    const strategy = this.getStrategy(user.role as RoleEnum)
    return strategy.getRequests(user)
  }
}