import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(text: string, end: number): unknown {
    const textLength = text.length
    return textLength > 70 ? `${text.slice(0, end)}...` : text;
  }

}
