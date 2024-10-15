import { Pipe, PipeTransform } from '@angular/core';

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
      case WeightTypeEnum.GROSS:
        return itemsWithValues.reduce((sum, item) => {
          const grossWeight = item.values.find((value: any) => value.name === WeightTypeEnum.GROSS);
          return sum + (grossWeight ? parseFloat(grossWeight.value) : 0);
        }, 0);
      
      case WeightTypeEnum.NET:
        return itemsWithValues.reduce((sum, item) => {
          const netWeight = item.values.find((value: any) => value.name === WeightTypeEnum.NET);
          return sum + (netWeight ? parseFloat(netWeight.value) : 0);
        }, 0);
      
      default:
        return 0
    }
  }
}
