import { inject, Pipe, PipeTransform } from '@angular/core';
import { ReportCellColorService } from '../../services/report-cell-color.service';

@Pipe({
  name: 'trackingColor',
})
export class TrackingColorPipe implements PipeTransform {

  private trackingColorService = inject(ReportCellColorService)

  transform(trackingNumber: string): string {
    return this.trackingColorService.getNextColor(trackingNumber)
  }

}
