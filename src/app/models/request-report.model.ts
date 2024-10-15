import { Column } from "./table.model";

export const requestReportTableColumns: Column[] = [
    {
        label: 'Tracking no',
        isSortable: false
    },
    {
        label: 'Creation date',
        isSortable: false
    },
    {
        label: 'Gross Weight',
        isSortable: false
    },
    {
        label: 'Net weight',
        isSortable: false
    },
    {
        label: 'Currency',
        isSortable: false
    },
    {
        label: 'Shipped to',
        isSortable: false
    },
    // {
    //     label: 'Plant',
    //     isSortable: false
    // },
    // {
    //     label: 'Plant name',
    //     isSortable: false
    // },
    {
        label: 'Incoterm',
        isSortable: false
    },
    {
        label: 'Invoice type',
        isSortable: false
    },
    {
        label: 'Carrier name',
        isSortable: false
    },
]