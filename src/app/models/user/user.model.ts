// export class User {

import { Column, TableProperty } from "../table.model";

//   userId : number ;
//   teId : string;
//   identifier: string;
//   userName : string;
//   email : string;
//   nPlus1 : string;
//   backUp : string;
//   role : string;
//   departementId : number ;
//   plantId?: number[];
//   constructor(
//     userId : number = 0,
//     teId : string = '' ,
//     userName : string = '',
//     email : string = '',
//     nPlus1 : string = '',
//     backUp : string = '',
//     role : string = '',
//     departementId : number = 0,
//     identifier: string= '',
//     plantId: number[] = [],
//   ){
//     this.userId = userId;
//     this.teId = teId;
//     this.userName = userName;
//     this.email = email;
//     this.nPlus1 = nPlus1;
//     this.backUp = backUp;
//     this.role = role;
//     this.departementId = departementId;
//     this.identifier=identifier;
//     this.plantId = plantId;
//   }

//  }


 export type User = {
  userId : number;
  teId : string;
  userName : string;
  email : string;
  nPlus1 : string;
  backUp : string;
  role : string;
  departementId : number ;
  plantsIds?: number[];
 }


 export const emptyUser: User = {
  userId: 0,
  teId: '',
  userName: '',
  email: '',
  nPlus1: '',
  backUp: '',
  role: '',
  departementId: 0,
  plantsIds: []
}


export type Plant = {
  id_plant: number;
  plantNumber: string;
  location: string;
  manager_plant: string;
  building_id: string;
  businessUnit: string;
}

export type LoggedInUser = {
  userId: number;
  teId: string;
  userName: string;
  email: string;
  nPlus1: null | string;
  backUp: string;
  role: string;
  pwd: string;
  departementId: number;
  userPlants: Plant[];
}

export const userTableProperties: TableProperty[] = [
  {
    name: 'userId',
    isDisplayed: false
  },
  {
    name: 'teId',
    isDisplayed: true
  },
  {
    name: 'userName',
    isDisplayed: true
  },
  {
    name: 'email',
    isDisplayed: true
  },
  {
    name: 'nPlus1',
    isDisplayed: true
  },
  {
    name: 'backUp',
    isDisplayed: true
  },
  {
    name: 'role',
    isDisplayed: true
  },
  {
    name: 'departementId',
    isDisplayed: false
  },
  {
    name: 'plantsIds',
    isDisplayed: false
  }
];

export const userTableColumns: Column[] = [
  {
    label: 'TEID',
    isSortable: false
  },
  {
    label: 'Username',
    isSortable: false
  },
  {
    label: 'Email',
    isSortable: false
  },
  {
    label: 'N+1',
    isSortable: false
  },
  {
    label: 'Backup',
    isSortable: false
  },
  {
    label: 'Role',
    isSortable: false
  },
  {
    label: 'Actions',
    isSortable: false
  }
]

export enum RoleEnum {
  ALL = '*',
  ADMIN = 'admin',
  REQUESTER = 'requester',
  FINANCE_APPROVER = 'finance',
  TRADECOMPLIANCE_APPROVER = 'tradecompliance',
  WAREHOUSE_APPROVER = 'warehouse'
}

export const Roles: string[] = Object.values(RoleEnum);


export const getUserRoleToDisplay = (role : any) => {
  switch (role) {
    case RoleEnum.ADMIN:
      return 'Admin'
    case RoleEnum.REQUESTER:
      return 'Requester'
    case RoleEnum.FINANCE_APPROVER:
      return 'Finance Approver'
    case RoleEnum.TRADECOMPLIANCE_APPROVER:
      return 'Trade Compliance Approver'
    case RoleEnum.WAREHOUSE_APPROVER:
      return 'Warehouse Approver'
    default:
      return 'None'
  }
}