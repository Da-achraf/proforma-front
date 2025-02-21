import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaButtonComponent } from './components/button.component';
import { CreateButtonComponent } from './components/create-button/create-button.component';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [BaButtonComponent, NoDataFoundComponent, CreateButtonComponent],
  exports: [BaButtonComponent, NoDataFoundComponent, CreateButtonComponent],
  providers: [],
})
export class UiModule {}
