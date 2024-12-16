import { Pipe, PipeTransform } from '@angular/core';
import { calculatTotalNetWeight } from '../helpers/invoice.helper';

export enum WeightTypeEnum {
  GROSS = 'Gross Weight',
  NET = 'Net Weight'
} 

@Pipe({
  name: 'weightCalculator'
})
export class WeightCalculatorPipe implements PipeTransform {

  transform(itemsWithValues: any[], type: WeightTypeEnum): number {
    switch(type) {
      case WeightTypeEnum.NET:
        return calculatTotalNetWeight(itemsWithValues)
  
      default:
        return 0
    }
  }
}
