import { Column, TableProperty } from "./table.model";

export interface Ship{
  id_ship: number; // Optional for when creating new ship points
  shipPoint: string;
  fullAddress: string;
  isTe: boolean;
}

export type ShipPointModel = {
  id_ship: number;
  shipPoint: string;
  fullAddress: string;
  isTe: boolean;
}

export type DeliveryAddressModel = {
  id_ship: number;
  deliveryAddress: string;
  fullAddress: string;
  isTe: boolean;
}

export const emptyShipPoint: ShipPointModel = {
  id_ship: 0,
  shipPoint: '',
  fullAddress: '',
  isTe: true
}

export const shipPointTableProperties: TableProperty[] = [
  {
    name: 'id_ship',
    isDisplayed: false
  },
  {
    name: 'shipPoint',
    isDisplayed: true
  },
  {
    name: 'fullAddress',
    isDisplayed: true
  },
];

export const shipPointTableColumns: Column[] = [
  {
    label: 'Ship Point',
    isSortable: false
  },
  {
    label: 'Full Address',
    isSortable: false
  },
  {
    label: 'Actions',
    isSortable: false
  }
]