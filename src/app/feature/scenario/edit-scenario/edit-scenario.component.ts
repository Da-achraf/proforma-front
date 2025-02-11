import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { forkJoin, switchMap } from 'rxjs';
import {
  MANDATORY_FOR_OPTIONS,
  MandatoryForEnum,
  RequestItemModel,
} from '../../../models/request-item.model';
import { RequestItemService } from '../../../services/request-item.service';
import { ScenarioItemConfigurationService } from '../../../services/scenario-item-configuration.service';
import { ScenarioService } from '../../../services/scenario.service';
import { ToasterService } from '../../../shared/services/toaster.service';
import { ScenarioStore } from '../scenario.store';

@Component({
  selector: 'app-edit-scenario',
  templateUrl: 'edit-scenario.component.html',
  styleUrl: 'edit-scenario.component.css'
})
export class EditScenarioComponent implements OnInit {
  protected readonly dialogRef = inject(MatDialogRef<EditScenarioComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly store = inject(ScenarioStore);
  protected readonly fb = inject(FormBuilder);
  protected readonly dialog = inject(MatDialog);
  protected readonly toastr = inject(ToasterService);
  protected readonly scenarioService = inject(ScenarioService);
  protected readonly requestItemService = inject(RequestItemService);
  protected readonly scenarioItemConfigurationService = inject(
    ScenarioItemConfigurationService
  );

  scenarioForm: FormGroup;
  scenarioId!: number;
  mandatoryForOptions = signal(MANDATORY_FOR_OPTIONS);
  myItems = signal<RequestItemModel[]>([]);

  constructor() {
    this.scenarioForm = this.fb.group({
      name: ['', Validators.required],
      items: this.fb.array([]),
    });

    effect(() => {
      const myItems = this.myItems();
      if (myItems.length === 0) return;
    });
  }

  ngOnInit(): void {
    this.scenarioId = this.data.scenario.id_scenario;
    this.loadItems();
    this.initializeForm();
  }

  private initializeForm(): void {
    const scenario = this.data.scenario;


    console.log('sceanario: ', scenario)

    // Set the basic scenario info
    this.scenarioForm.patchValue({
      name: scenario.name,
    });

    // Initialize items
    scenario.items.forEach((item: any) => {
      const itemGroup = this.fb.group({
        requestItemId: [item.id_request_item, Validators.required],
        isMandatory: [item.mandatoryFor],
      });

      this.items.push(itemGroup);
    });
  }

  get items(): FormArray {
    return this.scenarioForm.get('items') as FormArray;
  }

  loadItems() {
    this.requestItemService.getRequestItems().subscribe({
      next: (items: RequestItemModel[]) => {
        this.myItems.set(items);
      },
      error: (_) => this.toastr.showError('Error loading items'),
    });
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        requestItemId: ['', Validators.required],
        isMandatory: [[MandatoryForEnum.None]],
      })
    );
  }

  subtractItem(index: number): void {
    this.items.removeAt(index);
  }

  onItemFieldSelected(item: any, index: number) {
    const itemFieldId = item.value.requestItemId;
    const itemFieldsIds = this.items.controls.map(
      (control) => control.value.requestItemId
    );

    if (itemFieldsIds.length !== new Set(itemFieldsIds).size) {
      this.items.removeAt(index);
    }
  }

  onMandatoryForChange(selectedValues: string[], index: number) {
    const isMandatoryControl = this.items.at(index).get('isMandatory');

    if (selectedValues.length === 0) {
      isMandatoryControl?.setValue(['None']);
      return;
    }

    const isNoneNewlySelected = selectedValues.includes('None');
    if (isNoneNewlySelected) {
      isMandatoryControl?.setValue(['None']);
      return;
    }

    if (selectedValues.length > 1 && selectedValues.includes('None')) {
      const filteredValues = selectedValues.filter((value) => value !== 'None');
      isMandatoryControl?.setValue(filteredValues);
      return;
    }

    isMandatoryControl?.setValue(selectedValues);
  }

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      const formValue = this.scenarioForm.value;

      // Create the scenario update object
      const scenarioUpdate = {
        name: formValue.name,
      };

      id_scenario: this.scenarioId,
        // Update the scenario
        this.scenarioService
          .updateScenarios(this.scenarioId, scenarioUpdate)
          .pipe(
            switchMap((updatedScenario) => {
              // Create observables for updating item configurations
              const itemConfigUpdates = formValue.items.map((item: any) => {
                const itemConfig = {
                  id_scenario: this.scenarioId,
                  id_request_item: item.requestItemId,
                  isMandatory: false,
                  mandatoryFor: item.isMandatory.join(','),
                };

                return this.scenarioItemConfigurationService.updateScenarioItemsConfiguration(
                  // this.scenarioId,
                  // item.requestItemId,
                  itemConfig
                );
              });

              // Wait for all item configurations to be updated
              return forkJoin(itemConfigUpdates).pipe(
                switchMap(() => {
                  // Fetch the updated scenario
                  return this.scenarioService.getScenarioById(this.scenarioId);
                })
              );
            })
          )
          .subscribe({
            next: (updatedScenario) => {
              this.store.updateScenario(updatedScenario);
              this.dialogRef.close({ scenario: updatedScenario });
              this.toastr.showSuccess('Scenario updated successfully');
            },
            error: (error) => {
              this.toastr.showError('Failed to update scenario');
            },
          });
    } else {
      this.toastr.showWarning('Form is invalid');
    }
  }
}
