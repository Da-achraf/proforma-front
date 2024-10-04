import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isPropertyNotEmpty'
})
export class IsPropertyNotEmptyPipe implements PipeTransform {

  transform(value: unknown): boolean {
    console.log('value: ', value)
    const isValueString = typeof value == 'string'
    if (isValueString) return value.length != 0
    else return (value != null || value != undefined) 
  }
}
