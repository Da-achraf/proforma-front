import { RoleEnum } from "./user/user.model";

export const MandatoryForEnum = {
    Requester: 'Requester',
    Finance_Approver: 'Fianance Approver',
    Trade_Compliance_Approver: 'Trade&Compliance Approver',
    Warehouse_Approver: 'Warehouse Approver',
    None: 'None'
}

export const MANDATORY_FOR_OPTIONS = Object.values(MandatoryForEnum)

export const userRoleToMandatoryForMapper = (userRole: RoleEnum) => {
    switch(userRole) {
        case RoleEnum.REQUESTER:
            return MandatoryForEnum.Requester
        case RoleEnum.FINANCE_APPROVER:
            return MandatoryForEnum.Finance_Approver
        case RoleEnum.TRADECOMPLIANCE_APPROVER:
            return MandatoryForEnum.Trade_Compliance_Approver
        case RoleEnum.WAREHOUSE_APPROVER:
            return MandatoryForEnum.Warehouse_Approver
        default:
            return
    }
}

export class RequestItem {
    id_request_item: number;
    nameItem: string;

    constructor(
        id_request_item: number = 0,
        nameItem: string = ''
    ) {
        this.id_request_item = id_request_item;
        this.nameItem = nameItem;
    }
}

export type ItemField = {
    id?: number
    name: string
    type: FieldTypeEnum
    isMandatory?: boolean
    mandatoryFor?: string[]
}

export type ItemModel = {
    id_request_item?: number;
    nameItem: string;
    type: FieldTypeEnum;
    isMandatory?: boolean
    readOnly?: boolean
    mandatoryFor?: string[]
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
    mandatoryFor?: string[]
}

export const fieldTypes = Object.values(FieldTypeEnum)

export const standardFields: ItemField[] = [
    {
        name: 'Unit Value',
        type: FieldTypeEnum.NUMBER,
        isMandatory: false,
        mandatoryFor: [
            MandatoryForEnum.Finance_Approver,
            MandatoryForEnum.Warehouse_Approver
        ]
    },
    {
        name: 'Material',
        type: FieldTypeEnum.TEXT,
        isMandatory: true,
        mandatoryFor: [
            MandatoryForEnum.Requester,
            MandatoryForEnum.Warehouse_Approver
        ]
    },
    {
        name: 'Net Weight',
        type: FieldTypeEnum.NUMBER,
        isMandatory: false,
        mandatoryFor: [MandatoryForEnum.Warehouse_Approver]
    },
    {
        name: 'Quantity',
        type: FieldTypeEnum.NUMBER,
        isMandatory: true,
        mandatoryFor: [
            MandatoryForEnum.Requester,
            MandatoryForEnum.Warehouse_Approver
        ]
    },
    {
        name: 'Description',
        type: FieldTypeEnum.TEXT,
        isMandatory: false,
        mandatoryFor: [
            MandatoryForEnum.Requester,
            MandatoryForEnum.Warehouse_Approver
        ]
    },
    {
        name: 'Unit',
        type: FieldTypeEnum.TEXT,
        isMandatory: true,
        mandatoryFor: [
            MandatoryForEnum.Requester,
            MandatoryForEnum.Warehouse_Approver
        ]
    }
]

export const financeMandatoryFields: String[] = [
    'Unit Value'
]
