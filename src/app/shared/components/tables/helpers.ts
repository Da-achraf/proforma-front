import { ComponentType } from '@angular/cdk/portal';
import { EditRequestRequesterComponent } from '../../../components/edit-request-requester/edit-request-requester.component';
import { EditRequestTradcomplianceComponent } from '../../../components/edit-request-tradcompliance/edit-request-tradcompliance.component';
import { EditRequestWarehouseComponent } from '../../../components/edit-request-warehouse/edit-request-warehouse.component';
import { ModifyRequestFinanceComponent } from '../../../components/modify-request-finance/modify-request-finance.component';
import { JsonItemModel } from '../../../models/request.model';
import { RequestStatus } from '../../../models/requeststatus.model';
import { RoleEnum } from '../../../models/user/user.model';
import { FilterOption } from '../../../ui/components/radio-filter/types';

export const getRequestModificationComponent = (
  role: RoleEnum
): ComponentType<any> | undefined => {
  switch (role) {
    case RoleEnum.REQUESTER:
      return EditRequestRequesterComponent;
    case RoleEnum.FINANCE_APPROVER:
      return ModifyRequestFinanceComponent;
    case RoleEnum.TRADECOMPLIANCE_APPROVER:
      return EditRequestTradcomplianceComponent;
    case RoleEnum.WAREHOUSE_APPROVER:
      return EditRequestWarehouseComponent;
    default:
      return;
  }
};

const arrayToMap = (arr: JsonItemModel[]): { [key: string]: JsonItemModel } =>
  arr.reduce((acc, item) => ({ ...acc, [item.name]: item }), {});

export const mergeArrays = (
  oldArr: { values: JsonItemModel[] }[],
  newArr: { [key: string]: JsonItemModel }[]
): { [key: string]: JsonItemModel }[] => {
  // Process based on NEW array to respect deletions
  return newArr.map((newItem, index) => {
    const oldValues = oldArr[index]?.values || [];
    const oldMap = arrayToMap(oldValues);

    // Merge strategy: new values override old ones, but preserve old metadata
    return {
      ...oldMap,
      ...Object.fromEntries(
        Object.entries(newItem).map(([key, newEntry]) => [
          key,
          oldMap[key]
            ? { ...oldMap[key], value: newEntry.value } // Preserve old metadata
            : newEntry,
        ])
      ),
    };
  });
};

// // Function to convert an array of key-value pairs into an object
// const arrayToMap = (arr: JsonItemModel[]): { [key: string]: JsonItemModel } =>
//   arr.reduce((acc, item) => {
//     acc[item.name] = item;
//     return acc;
//   }, {} as { [key: string]: JsonItemModel });

//   // Improved function to merge the two arrays
// export const mergeArrays = (
//   oldArr: { values: JsonItemModel[] }[],
//   newArr: { [key: string]: JsonItemModel }[]
// ): { [key: string]: JsonItemModel }[] => {
//   return oldArr.map((oldItem, index) => {
//     const newItem = newArr[index] || {};

//     // Use the arrayToMap function to create the map from old values
//     const oldMap = arrayToMap(oldItem.values);

//     // Start merging values
//     const mergedItem: { [key: string]: JsonItemModel } = { ...oldMap }; // Start with oldMap

//     // Update or add values from newItem
//     for (const key in newItem) {
//       if (mergedItem[key]) {
//         // If the key exists in the old structure, update its value
//         mergedItem[key] = {
//           ...mergedItem[key],
//           value: newItem[key].value,
//         };
//       } else {
//         // If the key does not exist in oldItem, add the new value
//         mergedItem[key] = newItem[key];
//       }
//     }

//     return mergedItem;
//   });
// };

export const queryParamsByRole = (
  role: RoleEnum,
  loggedInUser: any
): { [key: string]: any } => {
  switch (role) {
    case RoleEnum.ADMIN:
      return {};

    case RoleEnum.REQUESTER:
      return {
        UserId: loggedInUser.userId,
      };

    case RoleEnum.FINANCE_APPROVER:
    case RoleEnum.TRADECOMPLIANCE_APPROVER:
    case RoleEnum.WAREHOUSE_APPROVER:
      return {
        ShipPointIds: loggedInUser.userShipPoints?.map((s: any) => s.id_ship),
      };

    default:
      return {};
  }
};
