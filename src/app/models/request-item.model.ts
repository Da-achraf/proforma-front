export class RequestItem {
    id_request_item: number;
    nameItem: string;

    constructor(
        id_request_item : number=0,
        nameItem :string=''
    ){
        this.id_request_item=id_request_item;
        this.nameItem=nameItem;
    }
}
