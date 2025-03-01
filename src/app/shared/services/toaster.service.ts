import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

// Constants for default values
const TOAST_LIFE = 3000;
const DEFAULT_INFO_SUMMARY = 'Info';
const DEFAULT_SUCCESS_SUMMARY = 'Success';
const DEFAULT_WARNING_SUMMARY = 'Warning';
const DEFAULT_ERROR_SUMMARY = 'Error';

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
    detail: string = 'Information message',
    summary: string = DEFAULT_INFO_SUMMARY,
    life: number = TOAST_LIFE
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
    detail: string = 'Operation completed successfully',
    summary: string = DEFAULT_SUCCESS_SUMMARY,
    life: number = TOAST_LIFE
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
    detail: string = 'Please proceed with caution',
    summary: string = DEFAULT_WARNING_SUMMARY,
    life: number = TOAST_LIFE
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
    detail: string = 'An error has occurred',
    summary: string = DEFAULT_ERROR_SUMMARY,
    life: number = TOAST_LIFE
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
