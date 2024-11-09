import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateArray'
})
export class GenerateArrayPipe implements PipeTransform {
  transform(value: number): any[] {
    // Check if the input is a valid number
    if (typeof value !== 'number' || isNaN(value) || value < 0 || !isFinite(value)) {
      return [];
    }

    // Create the array
    return Array.from({ length: Math.floor(value) }, (_, index) => index);
  }
}