import { RequestStatus } from '../../core/models/requeststatus.model';
import { FilterOption } from '../../ui/components/radio-filter/types';

export const StatusFilterOptions: FilterOption[] = [
  { label: 'All', title: 'All requests', value: 'all' },
  {
    label: 'Finance',
    title: 'Pending In Finance',
    value: RequestStatus.PendingInFinance.toString(),
  },
  {
    label: 'Trade&Compliance',
    title: 'Pending In Trade & Compliance',
    value: RequestStatus.PendingInTradCompliance.toString(),
  },
  {
    label: 'Warehouse',
    title: 'Pending In Warehouse',
    value: RequestStatus.InShipping.toString(),
  },
];