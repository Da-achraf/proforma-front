import { AsyncPipe, LowerCasePipe, NgClass, NgForOf } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectModule } from 'primeng/select';
import { COUNTRIES } from './data';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { MatInput } from '@angular/material/input';

interface Country {
  alpha2: string;
  alpha3: string;
  translations: {
    de: string;
    en: string;
    fr: string;
    it: string;
    es: string;
    ar: string;
    zh: string;
    hi: string;
    bn: string;
    pt: string;
    ru: string;
    [key: string]: string;
  };
}

@Component({
  selector: 'app-country-selector',
  template: `
    <mat-form-field appearance="fill" class="w-full">
      <mat-label>{{ placeholder }}</mat-label>
      <!-- The input triggers the autocomplete and is bound to a FormControl -->
      <input
        type="text"
        matInput
        [formControl]="countryCtrl"
        [matAutocomplete]="auto"
      />
      <!-- Autocomplete configuration -->
      <mat-autocomplete
        #auto="matAutocomplete"
        [displayWith]="displayFn"
        (optionSelected)="onCountrySelected($event.option.value)"
      >
        <mat-option
          *ngFor="let country of filteredCountries | async"
          [value]="country"
        >
          <div class="flex items-center gap-2">
            <span
              class="fi"
              [ngClass]="'fi-' + (country.alpha2 | lowercase)"
            ></span>
            <span>{{ country.translations.en }}</span>
          </div>
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectorComponent),
      multi: true,
    },
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    MatFormFieldModule,
    MatSelectModule,
    NgClass,
    MatAutocompleteModule,
    NgForOf,
    AsyncPipe,
    MatInput,
    LowerCasePipe,
  ],
})
export class CountrySelectorComponent implements ControlValueAccessor {
  @Input() lang: string = 'en'; // Default language (fallback is en)
  @Input() placeholder: string = 'Select a country';
  @Input() required: boolean = false;

  countries: Country[] = COUNTRIES;
  countryCtrl = new FormControl();
  filteredCountries!: Observable<Country[]>;

  selectedCountry: Country | null = null;
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    // When the user types, update the filtered countries.
    this.filteredCountries = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      // When the value is an object (a country) we want the name; otherwise, it’s the entered text.
      map((value) =>
        typeof value === 'string' ? value : value?.translations.en,
      ),
      map((name) =>
        name ? this._filterCountries(name) : this.countries.slice(),
      ),
    );
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(
      (country) =>
        country.translations.en.toLowerCase().includes(filterValue) ||
        country.alpha2.toLowerCase().includes(filterValue) ||
        country.alpha3.toLowerCase().includes(filterValue),
    );
  }

  // When displaying the selected value in the input, show the English translation.
  displayFn(country: Country): string {
    return country && country.translations ? country.translations.en : '';
  }

  onCountrySelected(country: Country): void {
    this.selectedCountry = country;
    // Emit the country's alpha2 code (you could also emit another value if needed)
    this.onChange(country ? country.alpha2 : null);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    if (value) {
      this.selectedCountry =
        this.countries.find(
          (c) => c.alpha2.toLowerCase() === value.toLowerCase(),
        ) || null;
      this.countryCtrl.setValue(this.selectedCountry);
    } else {
      this.selectedCountry = null;
      this.countryCtrl.setValue('');
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.countryCtrl.disable() : this.countryCtrl.enable();
  }
}
