import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtension'
})
export class FileExtensionPipe implements PipeTransform {
  transform(fileName: string): string {
    if (!fileName) {
      return '';
    }
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop() || '' : '';
  }
}
