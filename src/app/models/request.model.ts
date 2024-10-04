import { DeliveryAddressModel, ShipPointModel } from "./ship.model";
import { Column } from "./table.model";
import { LoggedInUser } from "./user/user.model";

export interface Item {
  id_items?: number;
  pn: string;
  quantity: number | null;
  unitofquantity: string;
  unitvaluefinance: number | null;
  description: string;
  costcenter: string;
  businessunit: string;
  plant: string;
}

export interface CreateRequest {
  requestNumber?: number;
  invoicesTypes?: string;
  shipPointId?: number;
  deliveryAddressId?: number;
  incoterm?: string;
  userId?: number;
  scenarioId?: number;
  dhlAccount?: string;
  htsCode?: string;
  coo?: string;
  trackingNumber?: string;
  numberOfBoxes?: number | null;
  weight?: number | null;
  created_at?: Date;
  status?: string;
  invoiceAddress?: string;
  exporterAddress?: string;
  shippedvia?: string;
  modeOfTransport?: string;
  dimension?:string;
  items: Item[];
}

export interface UpdateFinanceRequestDTO {
  userId: number;
  incoterm: string;
  dhlAccount: string;
  items: UpdateItemDTO[];
}

export interface UpdateItemDTO {
  id_items: number;
  unitvaluefinance: number;
}


export type Request = {
  trackingNumber: string | null;
  requestNumber: number;
  created_at: string;
  status: number;
  user: {
    userId: number;
    teId: string;
    userName: string;
    email: string;
    nPlus1: null;
    backUp: string;
    role: string;
    pwd: string;
    departementId: number;
    userPlants: Array<{
      plantNumber: string;
    }>;
  };
};

///////////////////////////////////////

interface ScenarioItem {
  name: string;
  isMandatory: boolean;
}

interface Scenario {
  id_scenario: number;
  name: string;
  items: ScenarioItem[];
}

export interface RequestItem {
  id_items: number;
  pn: string;
  quantity: number;
  unitofquantity: string;
  unitvaluefinance: number;
  description: string;
  costcenter: string;
  businessunit: string;
  plant: string;
  requestNumber: number | null;
}

export interface RequestModel {
  requestNumber: number;
  created_at: string;
  status: number;
  user: LoggedInUser;
  scenario: Scenario;
  invoicesTypes: string;
  invoicesAddress: string | null;
  shipPoint: ShipPointModel;
  deliveryAddress: DeliveryAddressModel;
  incoterm: string;
  scenarioId: number;
  coo: string;
  numberOfBoxes: string;
  weight: number;
  htsCode: string;
  dhlAccount: string;
  trackingNumber: string;
  dimension: string;
  invoiceAddress: string;
  exporterAddress: string;
  modeOfTransport: string;
  shippedVia: string;
  items: RequestItem[];
}

export enum ModeOfTransportEnum {
  BY_AIR = 'By Air',
  BY_ROAD = 'By Road',
  BY_MARITIME = 'By Maritime'
}

export const ModesOfTransports:string[] = Object.values(ModeOfTransportEnum)

export const adminRequestColumns: Column[] = [
  {label: 'Request Number', isSortable: false},
  {label: 'Date of Submission', isSortable: true},
  {label: 'Status', isSortable: false},
]

export const INCOTERMES = [
  'FCA', 'DAP', 'DDP'
]

export const otherUsersRequestColumns: Column[] = [
  {label: 'Request Number', isSortable: false},
  {label: 'Date of Submission', isSortable: true},
  {label: 'Status', isSortable: false},
  {label: 'Actions', isSortable: false},
]