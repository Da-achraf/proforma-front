import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-upload-button',
  templateUrl: 'upload-button.component.html',
  styleUrl: 'upload-button.component.css',
  standalone: false
})
export class UploadButtonComponent {
  title = input('Import');

  upload = output<void>();
}
