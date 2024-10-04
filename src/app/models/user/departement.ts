import { Column, TableProperty } from "../table.model";

export class Departement {
  id_departement: number;
  name: string;
  manager: string;

  constructor(
    id_departement: number = 0,
    name: string = '',
    manager: string = '',
 
  ) {
    this.id_departement = id_departement;
    this.name = name;
    this.manager = manager;
 
  }
}

export type DepartmentModel = {
  id: number;
  name: string;
  manager: string;
}

export const departementTableProperties: TableProperty[] = [
  {
    name: 'id_departement',
    isDisplayed: false
  },
  {
    name: 'name',
    isDisplayed: true
  },
  {
    name: 'manager',
    isDisplayed: true
  },
];

export const departementTableColumns: Column[] = [
  {
    label: 'Name',
    isSortable: false
  },
  {
    label: 'Manager',
    isSortable: false
  },
  {
    label: 'Actions',
    isSortable: false
  }
]