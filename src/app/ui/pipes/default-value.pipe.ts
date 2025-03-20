import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'defaultValue',
})
export class DefaultValuePipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);

  transform(
    value: any,
    defaultValue: string = `<span class="font-medium shadow cursor-pointer">---</span>`,
  ): SafeHtml {
    // Check for null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      return this.sanitizer.bypassSecurityTrustHtml(defaultValue);
    }
    return value;
  }
}
