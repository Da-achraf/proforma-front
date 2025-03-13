import { Component, input, output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-upload-button',
    templateUrl: 'upload-button.component.html',
    styleUrl: 'upload-button.component.css',
    imports: [MatTooltip]
})
export class UploadButtonComponent {
  title = input('Import');

  upload = output<void>();
}
