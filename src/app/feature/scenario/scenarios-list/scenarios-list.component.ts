import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GenericTableComponent } from '../../../pattern/table/generic-table.component';
import { ScenarioStore } from '../scenario.store';
import { COLUMNS, GLOBAL_FILTER_FIELDS } from './const';

@Component({
  selector: 'app-scenarios-list',
  templateUrl: './scenarios-list.component.html',
  styleUrl: './scenarios-list.component.css',
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    GenericTableComponent,
  ],
})
export class ScenariosListComponent {
  protected readonly store = inject(ScenarioStore);

  protected columns = signal(COLUMNS).asReadonly();
  protected globalFilterFields = signal(GLOBAL_FILTER_FIELDS).asReadonly();
}
