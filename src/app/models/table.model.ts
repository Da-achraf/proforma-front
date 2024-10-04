export type Column = {
    label: string
    isSortable: boolean
}

export enum TableNameEnum {
  USER = 'user',
  PLANT = 'plant',
  DEPARTMENT = 'department',
  SHIP_POINT = 'ship point'
} 

export type TableProperty = {
  name: string;
  isDisplayed: boolean;
}