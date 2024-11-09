import { Pipe, PipeTransform } from '@angular/core';
import { calculateTotal } from '../helpers/invoice.helper';

@Pipe({
  name: 'totalAmount'
})
export class TotalAmountPipe implements PipeTransform {

  transform(values: any[]): number {
    return calculateTotal(values)
  }

}
