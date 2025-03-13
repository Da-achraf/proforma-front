import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

@Component({
    selector: 'ba-button',
    template: `
    <button
      type="submit"
      [type]="type()"
      [title]="title()"
      (click)="onClick.emit($event)"
      class="w-full rounded-lg px-4 py-3 text-center opacity-100 text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 outline-none ring-primary ring-offset-2 focus:ring-2"
      [ngClass]="[
        disabled() || isLoading() ? 'pointer-events-none opacity-60' : '',
        buttonClass()
      ]"
      [disabled]="disabled() || isLoading()"
    >
      <div class="flex items-center justify-center">
        <!-- Show loading spinner or left icon based on loading state -->
        @if (isLoading() && iconPosition() === 'left') {
        <i class="fa-solid fa-spinner animate-spin mr-2"></i>
        } @else if (icon() && iconPosition() === 'left') {
        <i class="fa" [class]="iconClass()"></i>
        }

        <!-- Always show the label -->
        <span class="text-nowrap">{{ label() }}</span>

        <!-- Show loading spinner or right icon based on loading state -->
        @if (isLoading() && iconPosition() === 'right') {
        <i class="fa-solid fa-spinner animate-spin"></i>
        } @else if (icon() && iconPosition() === 'right') {
        <i class="fa" [class]="iconClass()"></i>
        }
      </div>
    </button>
  `,
  imports: [NgClass]
})
export class BaButtonComponent {
  // Signal Inputs
  type = input<'button' | 'submit' | 'reset'>('button');
  label = input<string>('');
  title = input<string>('');
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  icon = input<string | null>(null); // Font Awesome icon class (e.g., "fa fa-check")
  iconPosition = input<'left' | 'right'>('left');
  buttonClass = input<string>('bg-secondary-100 text-white hover:bg-secondary');
  customClass = input<string>('');
  ariaLabel = input<string>(''); // For accessibility

  protected readonly hasLabel = computed(() => this.label().length != 0);

  // Signal Output
  onClick = output<Event>();

  // Computed property for icon class
  iconClass = () => {
    const icon = this.icon();
    const iconPosition = this.iconPosition();
    const hasLabel = this.hasLabel();

    if (!hasLabel && icon) return icon;

    return icon ? `${icon} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}` : '';
  };
}
