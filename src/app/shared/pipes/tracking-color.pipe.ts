import { inject, Pipe, PipeTransform } from '@angular/core';
import { ReportCellColorService } from '../services/report-cell-color.service';
import { TransformedRequestModel } from '../../core/models/request.model';

@Pipe({
  name: 'trackingColor',
})
export class TrackingColorPipe implements PipeTransform {

  private trackingColorService = inject(ReportCellColorService)
  private readonly colors = ['#edf0e9', '#f0e9ed'];


  transform(requestNumber: number, allRequests: TransformedRequestModel[]): string {

    // Find the index of the current requestNumber in the allRequests array
    const index = allRequests.findIndex(req => req.requestNumber === requestNumber);

    // Use the index to determine the color
    const colorIndex = index % this.colors.length;
    return this.colors[colorIndex];

    // return this.trackingColorService.getColorForRequestNumber(requestNumber)
  }

}
