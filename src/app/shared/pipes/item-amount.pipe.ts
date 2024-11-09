import { Pipe, PipeTransform } from '@angular/core';
import { calculateAmount } from '../helpers/invoice.helper';

@Pipe({
  name: 'itemAmount'
})
export class ItemAmountPipe implements PipeTransform {

  transform(item: any): number {
    return calculateAmount(item)
  }

}
