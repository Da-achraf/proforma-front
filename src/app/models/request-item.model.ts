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


export type ItemField = {
    name: string
    type: FieldTypeEnum
}

export type ItemModel = {
    label: string
    fields: ItemField[]
}

export enum FieldTypeEnum {
    TEXT = 'text',
    NUMBER = 'number',
    BOOLEAN = 'boolean'
}

export enum CurrencyEnum {
    EUR = 'euro',
    MAD = 'dirham',
    USD = 'dollar'
}

export const fieldTypes = Object.values(FieldTypeEnum)

export const standardFields: ItemField[] = [
    {
        name: 'Unit Value',
        type: FieldTypeEnum.NUMBER
    },
    {
        name: 'Currency',
        type: FieldTypeEnum.TEXT
    },
    {
        name: 'Net Weight',
        type: FieldTypeEnum.NUMBER
    },
    {
        name: 'Gross Weigth',
        type: FieldTypeEnum.NUMBER
    },
    {
        name: 'Quantity',
        type: FieldTypeEnum.NUMBER
    }
]