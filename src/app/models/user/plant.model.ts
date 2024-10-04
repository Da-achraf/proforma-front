import { Column, TableProperty } from "../table.model";

export class Plant {
  id_plant: number;
  plantNumber: string;
  location: string;
  manager_plant: string;
  building_id: string;
  businessUnit: string;

  constructor(
    id_plant: number = 0,
    plantNumber: string = '',
    location: string = '',
    manager_plant: string = '',
    building_id: string = '',
    businessUnit: string = ''
  ) {
    this.id_plant = id_plant;
    this.plantNumber = plantNumber;
    this.location = location;
    this.manager_plant = manager_plant;
    this.building_id = building_id;
    this.businessUnit = businessUnit;
  }
}

export type PlantModel = {
  id: number;
  plantNumber: string;
  location: string;
  manager_plant: string;
  building_id: string;
  businessUnit: string;
}


export const plantTableProperties: TableProperty[] = [
  {
    name: 'idPlant',
    isDisplayed: false
  },
  {
    name: 'plantNumber',
    isDisplayed: true
  },
  {
    name: 'location',
    isDisplayed: true
  },
  {
    name: 'manager_plant',
    isDisplayed: true
  },
  {
    name: 'building_id',
    isDisplayed: true
  },
  {
    name: 'businessUnit',
    isDisplayed: true
  },
];

export const plantTableColumns: Column[] = [
  {
    label: 'Plant Number',
    isSortable: false
  },
  {
    label: 'Location',
    isSortable: false
  },
  {
    label: 'Plant Manager',
    isSortable: false
  },
  {
    label: 'Building Id',
    isSortable: false
  },
  {
    label: 'Business Unit',
    isSortable: false
  },
  {
    label: 'Actions',
    isSortable: false
  }
]