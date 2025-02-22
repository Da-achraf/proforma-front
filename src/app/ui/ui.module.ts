import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaButtonComponent } from './components/button.component';
import { CreateButtonComponent } from './components/create-button/create-button.component';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { RadioFilterComponent } from './components/radio-filter/radio.filter.component';
import { RadioFilterSkeletonComponent } from './components/radio-filter/radio-filter-skeleton.component';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [
    BaButtonComponent,
    NoDataFoundComponent,
    CreateButtonComponent,
    RadioFilterComponent,
    RadioFilterSkeletonComponent,
  ],
  exports: [
    BaButtonComponent,
    NoDataFoundComponent,
    CreateButtonComponent,
    RadioFilterComponent,
    RadioFilterSkeletonComponent,
  ],
  providers: [],
})
export class UiModule {}
