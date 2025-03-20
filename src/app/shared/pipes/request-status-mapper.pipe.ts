import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus, RequestStatusLabelMapping } from '../../core/models/requeststatus.model';

@Pipe({
  name: 'mapStatus',
  pure: true
})
export class RequestStatusMapper implements PipeTransform {

  transform(status: unknown): string {
    if (status != undefined) {
      return RequestStatusLabelMapping[status as RequestStatus];
    }
    return ''
  }

}
