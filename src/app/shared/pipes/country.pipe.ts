import { Pipe, PipeTransform } from '@angular/core';
import { COUNTRIES_DB, Country } from "@angular-material-extensions/select-country";

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {
  countries = COUNTRIES_DB

  transform(alpha2Code: string): string {
    const foundCountry: Country = this.countries.find(c => c.alpha2Code === alpha2Code) as Country
    return foundCountry?.alpha3Code ?? '';
  }

}
