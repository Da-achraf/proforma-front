export type Column = {
    label: string
    isSortable: boolean
}

export enum TableNameEnum {
  USER = 'users',
  PLANT = 'plants',
  DEPARTMENT = 'departments',
  SHIP_POINT = 'ship points'
} 

export type TableProperty = {
  name: string;
  isDisplayed: boolean;
}


// Report table
export enum ExportMenuOptionsEnum {
  CURRENT_PAGE = 'Current page',
  FILTERED_ITEMS = 'Filtered items',
  FULL_EXPORT = 'Full export',
}

export const exportMenuOptions: {name: ExportMenuOptionsEnum, icon: string}[] = [
  {
    name: ExportMenuOptionsEnum.CURRENT_PAGE,
    icon: 'insert_drive_file'
  },
  {
    name: ExportMenuOptionsEnum.FILTERED_ITEMS,
    icon: 'filter_alt'
  },
  {
    name: ExportMenuOptionsEnum.FULL_EXPORT,
    icon: 'file_download'
  },
]