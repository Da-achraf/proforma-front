import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaButtonComponent } from './components/button.component';
import { CreateButtonComponent } from './components/create-button/create-button.component';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { RadioFilterSkeletonComponent } from './components/radio-filter/radio-filter-skeleton.component';
import { RadioFilterComponent } from './components/radio-filter/radio.filter.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
  ],
  declarations: [
    BaButtonComponent,
    NoDataFoundComponent,
    CreateButtonComponent,
    UploadButtonComponent,
    RadioFilterComponent,
    RadioFilterSkeletonComponent,
  ],
  exports: [
    BaButtonComponent,
    NoDataFoundComponent,
    CreateButtonComponent,
    UploadButtonComponent,
    RadioFilterComponent,
    RadioFilterSkeletonComponent,
  ],
  providers: [],
})
export class UiModule {}
