import { Component, inject } from '@angular/core';
import { ToasterService } from '../../shared/services/toaster.service';
import { SeverityMap } from './toast.data';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  // Severity configuration
  severityMap = SeverityMap;

  protected readonly toastrService = inject(ToasterService);
}
