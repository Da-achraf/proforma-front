import { Component, effect, input, output, signal } from '@angular/core';
import { FilterOption } from './types';

@Component({
  selector: 'app-radio-filter',
  templateUrl: 'radio-filter.component.html',
  standalone: false
})
export class RadioFilterComponent {
  options = input.required<FilterOption[]>();
  initialSelected = input<string>();

  optionSelected = output<string>();

  // Generate a unique name to prevent radio group conflicts
  protected uniqueName = `radio-filter-${Math.random()
    .toString(36)
    .substring(2)}`;

  // Use a signal for local state management
  protected readonly selectedOption = signal<string | undefined>(undefined);

  // Initialize the selected option when options change
  optionsEffect = effect(
    () => {
      const options = this.options();
      const initial = this.initialSelected();

      if (options.length > 0) {
        this.selectedOption.set(initial || options[0].value);
        this.optionSelected.emit(initial || options[0].value);
      }
    },
    { allowSignalWrites: true }
  );

  onOptionChange(value: string): void {
    this.selectedOption.set(value);
    this.optionSelected.emit(value);
  }
}
