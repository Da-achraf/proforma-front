export class approverScenario {
    id_approver: number;
    role: string;
    classe:number;
    scenarioId: number;
    constructor(
        id_approver : number = 0,
        role :string='',
        classe: number =0,
        scenarioId: number=0
    ){
        this.id_approver = id_approver;
        this.role=role;
        this.classe=classe;
        this.scenarioId=scenarioId;
    }
}
