import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  // Injected dependencies
  messageService = inject(MessageService);

  /**
   * Show an info toast message.
   * @param detail The message content.
   * @param summary Optional summary text (default: 'Info').
   * @param life Optional duration in milliseconds (default: 3000).
   */
  showInfo(
    detail: string,
    summary: string = 'Info',
    life: number = 3000
  ): void {
    this.messageService.add({ severity: 'info', summary, detail, life });
  }

  /**
   * Show a success toast message.
   * @param detail The message content.
   * @param summary Optional summary text (default: 'Success').
   * @param life Optional duration in milliseconds (default: 3000).
   */
  showSuccess(
    detail: string,
    summary: string = 'Success',
    life: number = 3000
  ): void {
    this.messageService.add({ severity: 'success', summary, detail, life });
  }

  /**
   * Show a warning toast message.
   * @param detail The message content.
   * @param summary Optional summary text (default: 'Warning').
   * @param life Optional duration in milliseconds (default: 3000).
   */
  showWarning(
    detail: string,
    summary: string = 'Warning',
    life: number = 3000
  ): void {
    this.messageService.add({ severity: 'warn', summary, detail, life });
  }

  /**
   * Show an error toast message.
   * @param detail The message content.
   * @param summary Optional summary text (default: 'Error').
   * @param life Optional duration in milliseconds (default: 3000).
   */
  showError(
    detail: string,
    summary: string = 'Error',
    life: number = 3000
  ): void {
    this.messageService.add({ severity: 'error', summary, detail, life });
  }

  /**
   * Clear all toast messages.
   */
  clear(): void {
    this.messageService.clear();
  }
}
