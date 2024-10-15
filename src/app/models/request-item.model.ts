import { RoleEnum } from "./user/user.model";

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
    id?: number
    name: string
    type: FieldTypeEnum
    isMandatory?: boolean
}

export type ItemModel = {
    id_request_item?: number;
    nameItem: string;
    type: FieldTypeEnum;
    isMandatory?: boolean
    readOnly?: boolean
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


export type RequestItemModel = {
    id_request_item?: number;
    nameItem: string;
    type: FieldTypeEnum;
    isMandatory?: boolean;
    mandatoryFor?: RoleEnum[]
}

export const fieldTypes = Object.values(FieldTypeEnum)

export const standardFields: ItemField[] = [
    {
        name: 'Unit Value',
        type: FieldTypeEnum.NUMBER,
        isMandatory: false
    },
    {
        name: 'Material',
        type: FieldTypeEnum.TEXT,
        isMandatory: true
    },
    {
        name: 'Net Weight',
        type: FieldTypeEnum.NUMBER,
        isMandatory: false
    },
    {
        name: 'Gross Weight',
        type: FieldTypeEnum.NUMBER,
        isMandatory: false
    },
    {
        name: 'Quantity',
        type: FieldTypeEnum.NUMBER,
        isMandatory: true
    },
    {
        name: 'Description',
        type: FieldTypeEnum.TEXT,
        isMandatory: false
    },
    {
        name: 'Unit',
        type: FieldTypeEnum.TEXT,
        isMandatory: true
    }
]

export const financeMandatoryFields: String[] = [
    'Unit Value'
]
