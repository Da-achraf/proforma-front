import { Component, effect, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api'; // Import MessageService
import {
  MANDATORY_FOR_OPTIONS,
  MandatoryForEnum,
  RequestItemModel,
  standardFields,
} from '../../models/request-item.model';
import { Roles } from '../../models/user/user.model';
import { ApproverService } from '../../services/approver.service';
import { RequestItemService } from '../../services/request-item.service';
import { ScenarioItemConfigurationService } from '../../services/scenario-item-configuration.service';
import { ScenarioService } from '../../services/scenario.service';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export type Item = {
  id: string;
  label: string;
};

@Component({
  selector: 'app-configuration-home',
  templateUrl: './configuration-home.component.html',
  styleUrls: ['./configuration-home.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatIconModule,
  ],
})
export class ConfigurationHomeComponent implements OnInit {
  scenarioForm: FormGroup;
  itemsAvailable: any[] = [];
  roles: string[] = Roles;
  classes: number[] = [0, 1, 2, 3, 4];

  mandatoryFor = new FormControl('');
  mandatoryForOptions = signal(MANDATORY_FOR_OPTIONS);

  selectedValue = '';

  myItems = signal<RequestItemModel[]>([]);
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessageService,
    private scenarioService: ScenarioService,
    private requestItemService: RequestItemService,
    private approverService: ApproverService,
    private scenarioItemConfigurationService: ScenarioItemConfigurationService,
  ) {
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
      error: (_) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading items',
        }),
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
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item created successfully',
            });
            console.log('Item created successfully', response);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error creating item',
            });
            console.error('Error creating item:', error);
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      const formValue = this.scenarioForm.value;

      console.log('Scenario Form value: ', formValue);

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
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Scenario created successfully',
            });
            const scenarioId = response.id_scenario;

            formValue.items.forEach((item: any) => {
              const itemConfig = {
                id_scenario: scenarioId,
                id_request_item: item.requestItemId,
                isMandatory: false,
                mandatoryFor: item.isMandatory.join(','),
              };
              this.scenarioItemConfigurationService
                .CreatescenarioItemsConfiguration(itemConfig)
                .subscribe({
                  next: (res) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'Item configuration created successfully',
                    });
                    console.log('Item configuration created:', res);
                  },
                  error: (err) => {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Failed to create item configuration',
                    });
                    console.error('Failed to create item configuration:', err);
                  },
                });
            });

            // Creating approvers
            // formValue.approvers.forEach((approver: any) => {
            //   const approverConfig = {
            //     role: approver.role,
            //     classe: approver.class,
            //     scenarioId: scenarioId
            //   };
            //   this.approverService.createApprover(approverConfig).subscribe({
            //     next: (res) => {
            //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Approver configuration created successfully' });
            //       console.log('Approver configuration created:', res);
            //     },
            //     error: (err) => {
            //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create approver configuration' });
            //       console.error('Failed to create approver configuration:', err);
            //     }
            //   });
            // });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create scenario',
            });
            console.error('Failed to create scenario:', error);
          },
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Form is invalid',
      });
      console.error('Form is invalid');
    }
  }

  // onMandatoryForChange(selectedValues: string[], index: number) {
  //   const isMandatoryControl = this.items.at(index).get('isMandatory');

  //   // Scenario 1: When any normal approver is selected while "None" was previously selected
  //   if (selectedValues.length > 1 && selectedValues.includes('None')) {
  //     const filteredValues = selectedValues.filter(value => value !== 'None');
  //     isMandatoryControl?.setValue(filteredValues);
  //     return;
  //   }

  //   // Scenario 2: When "None" is selected while having other approvers
  //   if (selectedValues.includes('None')) {
  //     isMandatoryControl?.setValue(['None']);
  //     return;
  //   }

  //   // Scenario 3: When deselecting all options, default to "None"
  //   if (selectedValues.length === 0) {
  //     isMandatoryControl?.setValue(['None']);
  //     return;
  //   }

  //   // Scenario 4: Normal case - multiple approvers can be selected
  //   isMandatoryControl?.setValue(selectedValues);
  // }

  onMandatoryForChange(selectedValues: string[], index: number) {
    const isMandatoryControl = this.items.at(index).get('isMandatory');

    // If 'None' is newly selected (it wasn't in previous values but is in new selection)
    const previousValues = isMandatoryControl?.value || [];
    const isNoneNewlySelected =
      !previousValues.includes('None') && selectedValues.includes('None');

    if (isNoneNewlySelected) {
      // If None is explicitly selected, clear other selections
      isMandatoryControl?.setValue(['None']);
      return;
    }

    // If selecting other options while None is selected, remove None
    if (selectedValues.length > 1 && selectedValues.includes('None')) {
      const filteredValues = selectedValues.filter((value) => value !== 'None');
      isMandatoryControl?.setValue(filteredValues);
      return;
    }

    // When deselecting all options, default to "None"
    if (selectedValues.length === 0) {
      isMandatoryControl?.setValue(['None']);
      return;
    }

    // Normal case - multiple approvers can be selected
    isMandatoryControl?.setValue(selectedValues);
  }
}
