import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ScenarioUtilService {
  private previousValuesMap: { [index: number]: string[] } = {};

  onMandatoryForChange(
    selectedValues: string[],
    index: number,
    control: FormControl
  ) {
    const previousValues = this.previousValuesMap[index] || [];

    // Check if 'None' is newly selected
    const isNoneNewlySelected =
      !previousValues.includes('None') && selectedValues.includes('None');

    if (isNoneNewlySelected) {
      control.setValue(['None'], { emitEvent: false });
      this.previousValuesMap[index] = ['None'];
      return;
    }

    // If other options are selected with 'None', remove 'None'
    if (selectedValues.length > 1 && selectedValues.includes('None')) {
      const filteredValues = selectedValues.filter((value) => value !== 'None');
      control.setValue(filteredValues, { emitEvent: false });
      this.previousValuesMap[index] = filteredValues;
      return;
    }

    // Default to 'None' if nothing is selected
    if (selectedValues.length === 0) {
      control.setValue(['None'], { emitEvent: false });
      this.previousValuesMap[index] = ['None'];
      return;
    }

    // Update with the selected values
    control.setValue(selectedValues, { emitEvent: false });
    this.previousValuesMap[index] = selectedValues;
  }
}
