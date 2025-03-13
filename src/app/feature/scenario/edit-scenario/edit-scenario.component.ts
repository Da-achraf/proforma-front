import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin, switchMap } from 'rxjs';
import { CreateItemDialogComponent } from '../../../components/create-item-dialog/create-item-dialog.component';
import {
  MANDATORY_FOR_OPTIONS,
  MandatoryForEnum,
  RequestItemModel,
} from '../../../models/request-item.model';
import { RequestItemService } from '../../../services/request-item.service';
import { ScenarioItemConfigurationService } from '../../../services/scenario-item-configuration.service';
import { ScenarioService } from '../../../services/scenario.service';
import { LoadingDotsComponent } from '../../../shared/components/loading-dots/loading-dots.component';
import { ToasterService } from '../../../shared/services/toaster.service';
import { ScenarioUtilService } from '../scenario-util.service';

@Component({
  selector: 'app-edit-scenario',
  templateUrl: 'edit-scenario.component.html',
  styleUrl: 'edit-scenario.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatDivider,
    MatSelectModule,
    MatButtonModule,
    MatIcon,
    LoadingDotsComponent,
  ],
})
export class EditScenarioComponent implements OnInit {
  protected readonly dialogRef = inject(MatDialogRef<EditScenarioComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly fb = inject(FormBuilder);
  protected readonly dialog = inject(MatDialog);
  protected readonly toastr = inject(ToasterService);
  protected readonly scenarioService = inject(ScenarioService);
  protected readonly requestItemService = inject(RequestItemService);
  protected readonly scenarioItemConfigurationService = inject(
    ScenarioItemConfigurationService,
  );
  protected readonly scenarioUtilService = inject(ScenarioUtilService);

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

  createItem(): void {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((itemToSave: RequestItemModel) => {
      if (itemToSave) {
        this.requestItemService.saveRequestItem(itemToSave).subscribe({
          next: (response) => {
            this.myItems.update((items) => [...items, { ...response }]);
            this.toastr.showSuccess('Item created successfully');
          },
          error: () => this.toastr.showError('Error creating item'),
        });
      }
    });
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        requestItemId: ['', Validators.required],
        isMandatory: [[MandatoryForEnum.None]],
      }),
    );
  }

  subtractItem(index: number): void {
    this.items.removeAt(index);
  }

  onItemFieldSelected(item: any, index: number) {
    const itemFieldId = item.value.requestItemId;
    const itemFieldsIds = this.items.controls.map(
      (control) => control.value.requestItemId,
    );

    if (itemFieldsIds.length !== new Set(itemFieldsIds).size) {
      this.items.removeAt(index);
    }
  }

  onMandatoryForChange(selectedValues: string[], index: number) {
    const isMandatoryControl = this.items
      .at(index)
      .get('isMandatory') as FormControl;

    this.scenarioUtilService.onMandatoryForChange(
      selectedValues,
      index,
      isMandatoryControl,
    );
  }

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      const formValue = this.scenarioForm.value;

      // Create the scenario update object
      const scenarioUpdate = {
        name: formValue.name,
      };

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

              return this.scenarioItemConfigurationService.CreatescenarioItemsConfiguration(
                itemConfig,
              );
            });

            // Wait for all item configurations to be created
            return forkJoin(itemConfigUpdates).pipe(
              switchMap(() => {
                // Fetch the updated scenario
                return this.scenarioService.getScenarioById(this.scenarioId);
              }),
            );
          }),
        )
        .subscribe({
          next: (updatedScenario) => {
            this.dialogRef.close({ scenario: updatedScenario });
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
