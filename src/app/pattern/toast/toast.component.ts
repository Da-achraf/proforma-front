import { Component, inject } from '@angular/core';
import { ToasterService } from '../../shared/services/toaster.service';
import { SeverityMap } from './toast.data';
import { Toast } from 'primeng/toast';
import { ToastClassPipe } from './toast-class.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [Toast, ToastClassPipe, NgClass]
})
export class ToastComponent {
  // Severity configuration
  severityMap = SeverityMap;

  protected readonly toastrService = inject(ToasterService);
}
