import {
  Component,
  effect,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
  MatDialog,
  MatDialogModule,
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
  standardFields,
} from '../../../models/request-item.model';
import { Roles } from '../../../models/user/user.model';
import { ApproverService } from '../../../services/approver.service';
import { RequestItemService } from '../../../services/request-item.service';
import { ScenarioItemConfigurationService } from '../../../services/scenario-item-configuration.service';
import { ScenarioService } from '../../../services/scenario.service';
import { LoadingDotsComponent } from '../../../shared/components/loading-dots/loading-dots.component';
import { ToasterService } from '../../../shared/services/toaster.service';
import { ScenarioUtilService } from '../scenario-util.service';
import { ScenarioStore } from '../scenario.store';

@Component({
  selector: 'app-add-scenario',
  templateUrl: './add-scenario.component.html',
  styleUrl: './add-scenario.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatDivider,
    MatSelectModule,
    MatIcon,
    LoadingDotsComponent,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class AddScenarioComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AddScenarioComponent>);
  protected readonly store = inject(ScenarioStore);

  protected readonly fb = inject(FormBuilder);
  protected readonly dialog = inject(MatDialog);
  protected readonly toastr = inject(ToasterService);
  protected readonly scenarioService = inject(ScenarioService);
  protected readonly requestItemService = inject(RequestItemService);
  protected readonly approverService = Inject(ApproverService);
  protected readonly scenarioItemConfigurationService = inject(
    ScenarioItemConfigurationService,
  );
  protected readonly scenarioUtilService = inject(ScenarioUtilService);

  scenarioForm: FormGroup;
  itemsAvailable: any[] = [];
  roles: string[] = Roles;
  classes: number[] = [0, 1, 2, 3, 4];

  mandatoryFor = new FormControl('');
  mandatoryForOptions = signal(MANDATORY_FOR_OPTIONS);

  selectedValue = '';

  myItems = signal<RequestItemModel[]>([]);
  constructor() {
    this.scenarioForm = this.fb.group({
      name: ['', Validators.required],
      approvers: this.fb.array([]),
      items: this.fb.array([]),
    });

    effect(() => {
      const myItems = this.myItems();
      if (myItems.length === 0) return;

      // Clear the existing form array
      this.items.clear();

      const standardFieldsMap = new Map(standardFields.map((f) => [f.name, f]));

      // Create form group for each item and patch the form array
      myItems.forEach((item: RequestItemModel) => {
        const standardField = standardFieldsMap.get(item.nameItem);
        if (standardField) {
          const itemFormGroup = this.fb.group({
            requestItemId: [item.id_request_item, Validators.required],
            isMandatory: [standardField.mandatoryFor],
          });
          this.items.push(itemFormGroup);
        }
      });
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  get items(): FormArray {
    return this.scenarioForm.get('items') as FormArray;
  }

  get approvers(): FormArray {
    return this.scenarioForm.get('approvers') as FormArray;
  }

  addApprover(): void {
    this.approvers.push(
      this.fb.group({
        role: ['', Validators.required],
        class: ['', Validators.required],
      }),
    );
  }

  subtractApprover(): void {
    if (this.approvers.length > 0) {
      this.approvers.removeAt(this.approvers.length - 1);
    }
  }

  loadItems() {
    this.requestItemService.getRequestItems().subscribe({
      next: (items: RequestItemModel[]) => {
        this.myItems.set(items);
        this.itemsAvailable = items;
      },
      error: (_) => this.toastr.showError('Error loading items'),
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

  subtractItem(i: number): void {
    if (this.items.length > 0) {
      this.items.removeAt(i);
    }
  }

  onItemFieldSelected(itemField: any, index: number) {
    const itemFieldId = itemField.value.requestItemId;
    const itemFieldsIds = this.items.controls.map(
      (control) => control.value.requestItemId,
    );
    console.log(itemFieldsIds);
    if (itemFieldsIds.length !== new Set(itemFieldsIds).size) {
      this.items.removeAt(index);
    }
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

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      const formValue = this.scenarioForm.value;

      this.scenarioService
        .CreateScenarios({
          name: formValue.name,
          approvers: formValue.approvers.map((approver: any) => ({
            role: approver.role,
            class: approver.class,
          })),
          items: formValue.items.map((item: any) => ({
            requestItemId: item.requestItemId,
            isMandatory: item.isMandatory,
          })),
        })
        .pipe(
          switchMap((response) => {
            const scenarioId = response.id_scenario;

            // Create all item configurations for the scenario
            const itemConfigObservables = formValue.items.map((item: any) => {
              const itemConfig = {
                id_scenario: scenarioId,
                id_request_item: item.requestItemId,
                isMandatory: false,
                mandatoryFor: item.isMandatory.join(','),
              };
              return this.scenarioItemConfigurationService.CreatescenarioItemsConfiguration(
                itemConfig,
              );
            });

            // Wait for all item configurations to be created
            return forkJoin(itemConfigObservables).pipe(
              switchMap(() => {
                // Fetch the scenario with all its items using the scenario ID
                return this.scenarioService.getScenarioById(scenarioId);
              }),
            );
          }),
        )
        .subscribe({
          next: (scenario) => {
            this.dialogRef.close({ scenario });
          },
          error: (error) => {
            this.toastr.showError(
              'Failed to create scenario or fetch scenario details',
            );
          },
        });
    } else {
      this.toastr.showWarning('Form is invalid');
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

  // previousValuesMap: { [index: number]: string[] } = {};
  // onMandatoryForChange(selectedValues: string[], index: number) {
  //   const None = MandatoryForEnum.None

  //   const previousValues = this.previousValuesMap[index] || [];
  //   const isMandatoryControl = this.items.at(index).get('isMandatory');

  //   // Check if 'None' is newly selected
  //   const isNoneNewlySelected =
  //     !previousValues.includes(None) && selectedValues.includes(None);

  //   if (isNoneNewlySelected) {
  //     isMandatoryControl?.setValue([None], { emitEvent: false });
  //     this.previousValuesMap[index] = [None];
  //     return;
  //   }

  //   // If other options are selected with 'None', remove 'None'
  //   if (selectedValues.length > 1 && selectedValues.includes(None)) {
  //     const filteredValues = selectedValues.filter((value) => value !== None);
  //     isMandatoryControl?.setValue(filteredValues, { emitEvent: false });
  //     this.previousValuesMap[index] = filteredValues;
  //     return;
  //   }

  //   // Default to 'None' if nothing is selected
  //   if (selectedValues.length === 0) {
  //     isMandatoryControl?.setValue([None], { emitEvent: false });
  //     this.previousValuesMap[index] = [None];
  //     return;
  //   }

  //   // Update with the selected values
  //   isMandatoryControl?.setValue(selectedValues, { emitEvent: false });
  //   this.previousValuesMap[index] = selectedValues;
  // }
}
