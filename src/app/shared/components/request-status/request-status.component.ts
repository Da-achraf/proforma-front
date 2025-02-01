import { Component, input } from '@angular/core';
import { RequestStatus } from '../../../models/requeststatus.model';

@Component({
  selector: 'app-request-status',
  template: `
    @if(status(); as status){
    <span
      class="whitespace-nowrap flex items-center gap-x-2 flex-nowrap rounded-md p-2 w-fit font-bold text-xs shadow-xl hover:cursor-pointer hover:shadow-2xl"
      [ngClass]="status | statusClass"
    >
      <i
        class="pi"
        [ngClass]="{
            'pi-check-circle':
            status === RequestStatusEnum.Done,
            'pi-spinner-dotted':
            status != RequestStatusEnum.Done,
        }"
        style="font-size: 0.8rem"
      ></i>
      {{ status | mapStatus }}
    </span>
    }
  `,
})
export class RequestStatusComponent {
  status = input.required<number>();
  RequestStatusEnum = RequestStatus;
}
