export class SceanrioItemConfiguration {
    id?:number;
    id_scenario:number;
    id_request_item:number;
    isMandatory: boolean;

    constructor(
        id : number=0,
        id_scenario:number =0,
        id_request_item : number =0,
        isMandatory : boolean=false,
    ){
        this.id=id;
        this.id_request_item=id_request_item;
        this.id_scenario=id_scenario;
        this.isMandatory=isMandatory;
    }
}