import { ComponentType } from "@angular/cdk/portal"
import { RoleEnum } from "../../../models/user/user.model"
import { ModifyRequestFinanceComponent } from "../../../components/modify-request-finance/modify-request-finance.component"
import { EditRequestTradcomplianceComponent } from "../../../components/edit-request-tradcompliance/edit-request-tradcompliance.component"
import { EditRequestWarehouseComponent } from "../../../components/edit-request-warehouse/edit-request-warehouse.component"
import { RequestStatus } from "../../../models/requeststatus.model"

export const getRequestModificationComponent = (role: RoleEnum): ComponentType<any> | undefined => {
    switch (role){
      case RoleEnum.REQUESTER:
        return ModifyRequestFinanceComponent
      case RoleEnum.FINANCE_APPROVER:
        return ModifyRequestFinanceComponent
      case RoleEnum.TRADECOMPLIANCE_APPROVER:
        return EditRequestTradcomplianceComponent
      case RoleEnum.WAREHOUSE_APPROVER:
        return EditRequestWarehouseComponent
      default:
        return
    }
  }

  export const getStatusClass = (status: number): string => {
    switch (status) {
      case RequestStatus.PendingInFinance:
        return 'bg-cyan-400 text-gray-100';
      case RequestStatus.PendingInTradCompliance:
        return 'bg-orange-400 text-gray-50';
      case RequestStatus.InShipping:
        return 'bg-yellow-400 text-gray-50';
      case RequestStatus.Done:
        return 'bg-green-400 text-gray-50';
      case RequestStatus.Rejected:
        return 'bg-red-400 text-gray-50';
      default:
        return '';
    }
  }