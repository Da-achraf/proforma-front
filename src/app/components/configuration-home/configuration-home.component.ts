import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api'; // Import MessageService
import { ScenarioService } from '../../services/scenario.service';
import { RequestItemService } from '../../services/request-item.service';
import { ApproverService } from '../../services/approver.service';
import { ScenarioItemConfigurationService } from '../../services/scenario-item-configuration.service';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';
import { Router,ActivatedRoute } from '@angular/router'; // Import Router
import { map } from 'rxjs'
import { Roles } from '../../models/user/user.model';

export type Item = {
  id: string;
  label: string;
}

@Component({
  selector: 'app-configuration-home',
  templateUrl: './configuration-home.component.html',
  styleUrls: ['./configuration-home.component.css']
})
export class ConfigurationHomeComponent implements OnInit {
  scenarioForm: FormGroup;
  itemsAvailable: any[] = [];
  roles: string[] = Roles
  classes: number[] = [0, 1, 2, 3, 4];

  myItems = signal<Item[]>([])

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessageService, // Inject MessageService
    private scenarioService: ScenarioService,
    private requestItemService: RequestItemService,
    private approverService: ApproverService,
    private scenarioItemConfigurationService: ScenarioItemConfigurationService,
  ) {
    this.scenarioForm = this.fb.group({
      name: ['', Validators.required],
      approvers: this.fb.array([]),
      items: this.fb.array([])  // Start with an empty FormArray
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
    this.approvers.push(this.fb.group({
      role: ['', Validators.required],
      class: ['', Validators.required]
    }));
  }

  subtractApprover(): void {
    if (this.approvers.length > 0) {
      this.approvers.removeAt(this.approvers.length - 1);
    }
  }

  loadItems() {
    this.requestItemService.getRequestItems().pipe(
      map((data: any[]) => data.map(item => ({id: item.id_request_item, label: item.nameItem}) as Item))
    )
    .subscribe({
      next: (items: Item[]) => {
        console.log('items: ', items)
        this.myItems.set(items)
        this.itemsAvailable = items;
      },
      error: _ => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading items' })
    });
  }

  addItem(): void {
    this.items.push(this.fb.group({
      requestItemId: ['', Validators.required],
      isMandatory: [false]
    }));
  }

  subtractItem(): void {
    if (this.items.length > 0) {
      this.items.removeAt(this.items.length - 1);
    }
  }

  createItem(): void {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '800px',
      // data: { nameItem: '' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log('item: ', data)
      }
      // if (data && data.label) {
      //   console.log('creating new item')
      //   this.requestItemService.saveRequestItem({ nameItem: data.label }).subscribe({
      //     next: (response) => {
      //       this.myItems.update(items => [...items, {id: response.id_request_item, label: response.nameItem}])
      //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item created successfully' });
      //       console.log('Item created successfully', response);
      //     },
      //     error: (error) => {
      //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating item' });
      //       console.error('Error creating item:', error);
      //     }
      //   });
      // }
    });
  }

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      const formValue = this.scenarioForm.value;

      console.log('Scenario Form value: ', formValue)

      this.scenarioService.CreateScenarios({
        name: formValue.name,
        approvers: formValue.approvers.map((approver: any) => ({
          role: approver.role,
          class: approver.class
        })),
        items: formValue.items.map((item: any) => ({
          requestItemId: item.requestItemId,
          isMandatory: item.isMandatory
        }))
      }).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Scenario created successfully' });
          console.log('Scenario created:', response);
          const scenarioId = response.id_scenario;

          formValue.items.forEach((item: any) => {
            const itemConfig = {
              id_scenario: scenarioId,
              id_request_item: item.requestItemId,
              isMandatory: item.isMandatory
            };
            this.scenarioItemConfigurationService.CreatescenarioItemsConfiguration(itemConfig).subscribe({
              next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item configuration created successfully' });
                console.log('Item configuration created:', res);
              },
              error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create item configuration' });
                console.error('Failed to create item configuration:', err);
              }
            });
          });

          formValue.approvers.forEach((approver: any) => {
            const approverConfig = {
              role: approver.role,
              classe: approver.class,
              scenarioId: scenarioId
            };
            this.approverService.createApprover(approverConfig).subscribe({
              next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Approver configuration created successfully' });
                console.log('Approver configuration created:', res);
              },
              error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create approver configuration' });
                console.error('Failed to create approver configuration:', err);
              }
            });
          });

          // Navigate to the same route to refresh the component
          // const currentUrl = this.router.url;
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([currentUrl]);
          // });

        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create scenario' });
          console.error('Failed to create scenario:', error);
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Form is invalid' });
      console.error('Form is invalid');
    }
  }
}
