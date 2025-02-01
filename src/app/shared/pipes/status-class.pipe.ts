import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../../models/requeststatus.model';

@Pipe({
  name: 'statusClass',
})
export class StatusClassPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case RequestStatus.PendingInFinance:
        return 'bg-cyan-400 text-gray-100';
      case RequestStatus.PendingInTradCompliance:
        return 'bg-orange-400 text-gray-50';
      case RequestStatus.InShipping:
        return 'bg-purple-400 text-gray-50';
      case RequestStatus.WaitingForTrackingNo:
        return 'bg-teal-400 text-gray-50';
      case RequestStatus.Done:
        return 'bg-green-500 text-gray-50';
      case RequestStatus.Rejected:
        return 'bg-red-400 text-gray-50';
      default:
        return '';
    }
  }
}
