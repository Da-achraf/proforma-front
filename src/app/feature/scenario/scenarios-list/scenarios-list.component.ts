import { Component, inject, signal } from '@angular/core';
import { ScenarioStore } from '../scenario.store';
import { COLUMNS, GLOBAL_FILTER_FIELDS } from './const';

@Component({
  selector: 'app-scenarios-list',
  templateUrl: './scenarios-list.component.html',
  styleUrl: './scenarios-list.component.css',
})
export class ScenariosListComponent {
  protected readonly store = inject(ScenarioStore);

  protected columns = signal(COLUMNS).asReadonly();
  protected globalFilterFields = signal(GLOBAL_FILTER_FIELDS).asReadonly();

}
