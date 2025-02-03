import { ItemModel } from "./request-item.model";

export class Scenario {
  id_scenario: number;
  name: string;
  approverId: number;
  constructor(
    id_scenario: number =0,
    name: string='',
    approverId: number=0
  ){
    this.id_scenario=id_scenario;
    this.name=name;
    this.approverId=approverId;
  }
}


export type ScenarioModel = {
  id_scenario: number;
  name: string;
  requestCount: number;
  items: ItemModel[];
};


export const emptyScenario: ScenarioModel = {
  id_scenario: 0,
  name: '',
  requestCount: 0,
  items: []
}
