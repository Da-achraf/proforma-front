import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../../models/requeststatus.model';

@Pipe({
  name: 'statusClass',
})
export class StatusClassPipe implements PipeTransform {
  transform(status: number): string {
    const baseClasses = `rounded-lg border-l-[5px] shadow-lg px-2.5 py-1.5 text-xs font-semibold 
    border-t-[.1px] border-r-[.1px] border-b-[.1px] border-t-gray-300 border-b-gray-300 border-r-gray-300 `;

    switch (status) {
      case RequestStatus.PendingInFinance:
        return `${baseClasses} bg-blue-50/80 text-blue-900 border-blue-500 shadow-blue-500 hover:bg-blue-100`;
      case RequestStatus.PendingInTradCompliance:
        return `${baseClasses} bg-amber-50/80 text-amber-900 border-amber-500 shadow-amber-500 hover:bg-amber-100`;
      case RequestStatus.InShipping:
        return `${baseClasses} bg-purple-50/80 text-purple-900 border-purple-500 shadow-purple-500 hover:bg-purple-100`;
      case RequestStatus.WaitingForTrackingNo:
        return `${baseClasses} bg-indigo-50/80 text-indigo-900 border-indigo-500 shadow-indigo-500 hover:bg-indigo-100`;
      case RequestStatus.Done:
        return `${baseClasses} bg-emerald-50/80 text-emerald-900 border-emerald-500 shadow-emerald-500 hover:bg-emerald-100`;
      case RequestStatus.Rejected:
        return `${baseClasses} bg-red-50/80 text-red-900 border-red-500 shadow-red-500 hover:bg-red-100`;
      default:
        return `${baseClasses} bg-gray-50/80 text-gray-700 border-gray-400 shadow-gray-500 hover:bg-gray-100`;
    }
  }
}
