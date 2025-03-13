import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RequestStatus } from '../../../models/requeststatus.model';
import { RequestStatusMapper } from '../../pipes/request-status-mapper.pipe';
import { StatusClassPipe } from '../../pipes/status-class.pipe';

@Component({
  selector: 'app-request-status',
  template: `
    @if (status() >= 0) {
      <span
        class="inline-flex cursor-pointer items-center gap-x-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 transition-all hover:scale-[1.02]"
        [ngClass]="status() | statusClass"
      >
        <i
          class="pi"
          [ngClass]="{
            'pi-check-circle': status() === RequestStatusEnum.Done,
            'pi-spinner-dotted': status() !== RequestStatusEnum.Done,
            'pi-times-circle': status() === RequestStatusEnum.Rejected,
          }"
          style="font-size: 0.8rem"
        ></i>
        {{ status() | mapStatus }}
      </span>
    }
  `,
  imports: [NgClass, StatusClassPipe, RequestStatusMapper],
})
export class RequestStatusComponent {
  status = input.required<number>();
  RequestStatusEnum = RequestStatus;
}
