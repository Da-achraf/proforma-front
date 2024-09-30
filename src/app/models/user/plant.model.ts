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