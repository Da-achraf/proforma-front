import { FieldTypeEnum, ItemModel } from "./request-item.model";
import { ScenarioModel } from "./scenario.model";
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
  costCenter?: string;
  userId?: number;
  scenarioId?: number;
  dhlAccount?: string;
  htsCode?: string;
  coo?: string;
  trackingNumber?: string;
  numberOfBoxes?: number | null;
  created_at?: Date;
  status?: string;
  invoiceAddress?: string;
  exporterAddress?: string;
  shippedvia?: string;
  modeOfTransport?: string;
  dimension?:string;
  currency?: string;
  // items: Item[];
  itemsWithValuesJson?: string
}

export interface UpdateFinanceRequestDTO {
  userId: number;
  incoterm: string;
  dhlAccount: string;
  items: UpdateItemDTO[];
  currency: string;
  itemsWithValuesJson?: string
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
  scenario: ScenarioModel;
  invoicesTypes: string;
  invoicesAddress: string | null;
  shipPoint: ShipPointModel;
  deliveryAddress: DeliveryAddressModel;
  incoterm: string;
  scenarioId: number;
  numberOfBoxes: string;
  dhlAccount: string;
  trackingNumber: string;
  dimension: string;
  invoiceAddress: string;
  exporterAddress: string;
  modeOfTransport: string;
  currency: string;
  costCenter: string;
  shippedVia: string;
  grossWeight?: number,
  itemsWithValues: {values: JsonItemModel[]}[]
  items: RequestItem[];
}

export type JsonItemModel = {
  name: string
  value: string
  type: FieldTypeEnum,
  isMandatory: boolean
}

export enum ModeOfTransportEnum {
  BY_AIR = 'By Air',
  BY_ROAD = 'By Road',
  BY_MARITIME = 'By Maritime'
}

export const ModesOfTransports:string[] = Object.values(ModeOfTransportEnum)

export const sharedRequestColumns: Column[] = [
  {label: 'Request Number', isSortable: false},
  {label: 'Date of Submission', isSortable: true},
  {label: 'Status', isSortable: false},
]

export const otherUsersRequestColumns: Column[] = [
  ... sharedRequestColumns,
  {label: 'Actions', isSortable: false},
]

export const INCOTERMES = [
  'FCA', 'DAP', 'DDP'
]

export const SHIPPED_VIA_OPTIONS = [
  'Van', 'Trailer', 'Container', 'Plant'
]

export const INVOICE_TYPES = [
  'Proforma Invoice',
  'Manual Commercial'
]

export enum InvoiceTypeEnum {
  PROFORMA = 'Proforma Invoice',
  COMMERCIAL = 'Manual Commercial'
}

export enum StandardFieldEnum {
  QUANTITY = "Quantity",
  UNIT_VALUE = "Unit Value",
  UNIT = "Unit",
  DESCRIPTION = "Description",
  COST_CENTER = "Cost Center",
  BUSINESS_UNIT = "Business Unit",
  GROSS_WEIGHT = "Gross Weight",
  NET_WEIGHT = "Net Weight"
}

export const standardFieldsNames: string[] = Object.values(StandardFieldEnum)

// Target date format of created_at field of the request
export const createdAtFormat = "MMM d, y 'at' h:mm a"

export const CURRENCY_CODES: string[] = [
  "MAD", // Moroccan Dirham
  "USD", // United States Dollar
  "EUR", // Euro
  "JPY", // Japanese Yen
  "GBP", // British Pound
  "CHF", // Swiss Franc
  "CAD", // Canadian Dollar
  "AUD", // Australian Dollar
  "CNY", // Chinese Yuan
  "INR", // Indian Rupee
  "BRL", // Brazilian Real
  "ZAR", // South African Rand
  "NZD", // New Zealand Dollar
  "SGD", // Singapore Dollar
  "HKD", // Hong Kong Dollar
  "MXN", // Mexican Peso
  "RUB", // Russian Ruble
  "TRY", // Turkish Lira
  "SEK", // Swedish Krona
  "NOK", // Norwegian Krone
  "DKK", // Danish Krone
  "PLN", // Polish Zloty
  "THB", // Thai Baht
  "AED", // United Arab Emirates Dirham
  "ILS", // Israeli New Shekel
  "MYR", // Malaysian Ringgit
  "PHP",  // Philippine Peso
];
