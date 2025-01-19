import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../../models/requeststatus.model';

/**
 * A pipe that return true or false whether
 * the invoice is available for download based on
 * the request status.
 *
 */
@Pipe({
  name: 'invoiceavailablity',
})
export class InvoiceAvailabilityPipe implements PipeTransform {
  transform(status: RequestStatus): boolean {
    if (!status) return false;

    return (
      status === RequestStatus.WaitingForTrackingNo ||
      status === RequestStatus.Done
    );
  }
}
