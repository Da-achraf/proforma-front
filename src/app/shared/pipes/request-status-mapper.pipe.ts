import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus, RequestStatusLabelMapping } from '../../models/requeststatus.model';

@Pipe({
  name: 'statusMapper',
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
