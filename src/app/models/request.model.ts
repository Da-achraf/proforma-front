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
  shippingPoint?: string;
  deliveryAddress?: string;
  incoterm?: string;
  operationtype? : string;
  userId?: number;
  scenarioId?: number;
  dhlAccount?: string;
  htsCode?: string;
  coo?: string;
  trackingnumber?: string;
  numberofboxes?: string | null;
  weight?: number | null;
  created_at?: Date;
  status?: string;
  invoiceAddress?: string;
  exporterAddress?: string;
  shippedvia?: string;
  modeoftransport?: string;
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
  shippingPoint: string;
  deliveryAddress: string;
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