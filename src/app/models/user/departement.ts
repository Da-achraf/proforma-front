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
  