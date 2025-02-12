import { Component, input } from '@angular/core';
import { RequestStatus } from '../../../models/requeststatus.model';

@Component({
  selector: 'app-request-status',
  template: `
    @if(status() != null; as _){
    <span
      class="whitespace-nowrap inline-flex items-center gap-x-1.5 rounded-lg px-3 py-1.5 cursor-pointer transition-all hover:scale-[1.02]"
      [ngClass]="status() | statusClass"
    >
      <i
        class="pi"
        [ngClass]="{
            'pi-check-circle': status() === RequestStatusEnum.Done,
            'pi-spinner-dotted': status() !== RequestStatusEnum.Done,
            'pi-times-circle': status() === RequestStatusEnum.Rejected
        }"
        style="font-size: 0.8rem"
      ></i>
      {{ status() | mapStatus }}
    </span>
    }
  `,
})
export class RequestStatusComponent {
  status = input.required<number>();
  RequestStatusEnum = RequestStatus;
}
