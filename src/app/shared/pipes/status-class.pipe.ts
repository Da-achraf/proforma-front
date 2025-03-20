import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../../core/models/requeststatus.model';

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
        return `${baseClasses} bg-orange-50/80 text-orange-900 border-orange-500 shadow-orange-500 hover:bg-orange-100`;
      case RequestStatus.InShipping:
        return `${baseClasses} bg-fuchsia-50/80 text-fuchsia-900 border-fuchsia-500 shadow-fuchsia-500 hover:bg-fuchsia-100`;
      case RequestStatus.WaitingForTrackingNo:
        return `${baseClasses} bg-violet-50/80 text-violet-900 border-violet-500 shadow-violet-500 hover:bg-violet-100`;
      case RequestStatus.Done:
        return `${baseClasses} bg-green-50/80 text-green-900 border-green-500 shadow-green-500 hover:bg-green-100`;
      case RequestStatus.Rejected:
        return `${baseClasses} bg-rose-50/80 text-rose-900 border-rose-500 shadow-rose-500 hover:bg-rose-100`;
      default:
        return `${baseClasses} bg-gray-50/80 text-gray-700 border-gray-400 shadow-gray-500 hover:bg-gray-100`;
    }
  }
}
