import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ItemField } from '../../models/request-item.model';
import { INCOTERMES, ModesOfTransports } from '../../models/request.model';
import { Ship } from '../../models/ship.model';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { ScenarioService } from '../../services/scenario.service';
import { ShippointService } from '../../services/shippoint.service';

@Component({
  selector: 'app-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.css']
})
export class CreateRequestDialogComponent implements OnInit {
  requestForm: FormGroup;
  // scenarios: any[] = [];
  shipPoints: Ship[] = [];
  scenarioAttributes: any[] = [];
  invoiceTypes: string[] = ['Proforma Invoice', 'Manual Commercial']
  incoterms: string[] = INCOTERMES
  modesOfTransports: string[] = ModesOfTransports

  constructor(
    private fb: FormBuilder,
    private scenarioService: ScenarioService,
    private shippointService: ShippointService,
    private requestService: RequestService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<CreateRequestDialogComponent>
  ) {
    this.requestForm = this.fb.group({
      invoicesTypes: ['', Validators.required],
      scenarioId: ['', Validators.required],
      shippingPoint: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      incoterm: ['', Validators.required],
      dhlAccount: [''],
      numberOfBoxes: [''],
      modeOfTransport: ['', Validators.required],
      shippedVia: ['', Validators.required],
      weight: ['', [Validators.required]],
      dimension: [''],
      items: this.fb.array([]) // Initialisation du FormArray pour les items
    });

    effect(() => {
      const selectedScenario = this.selectedScenario()

      if (!selectedScenario) return
      this.populateForm()
    })


  }

  // Signals
  scenarios = toSignal(this.scenarioService.getScenarios())
  selectedScenarioId = signal(0)
  selectedScenario = computed(() => {
    const allSceanrios = this.scenarios()
    const selectedScenarioId = this.selectedScenarioId()

    if (allSceanrios &&selectedScenarioId != 0){
      return allSceanrios.find(scenario => scenario.id_scenario === selectedScenarioId)
    }
    return undefined
  })

  ngOnInit(): void {
    // this.loadScenarios();
    this.loadShipPoints();
    this.onScenarioChange();
    this.onShippingOrDeliveryChange();
  }

  populateForm() {
    const itemsArray = this.requestForm.get('items') as FormArray;

    // Clear any existing form array entries
    itemsArray.clear();

    const selectedScenario = this.selectedScenario()
    if (!selectedScenario) return

    // Loop through each item and add a new FormGroup for it
    selectedScenario.items.forEach(item => {
      itemsArray.push(this.fb.group({
        nameItem: [item.nameItem],
        fields: this.fb.array(
          item.fields.map((field: ItemField) => this.fb.group({
            id: [field.id],
            name: [field.name],
            type: [field.type],
            value: ['', field.type === 'number' ? Validators.required : Validators.nullValidator]
          }))
        )
      }));
    });

    console.log('Called populateForm')
  }

  /******************methodes items*****************/
  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  fieldsArray(index: number): FormArray {
    return this.items.at(index).get('fields') as FormArray;
  }

  // addItem(): void {
  //   this.items.push(this.fb.group({
  //     pn: ['', Validators.required],
  //     quantity: [null, Validators.required],
  //     unitofquantity: ['', Validators.required],
  //     unitvaluefinance: [null, Validators.required],
  //     description: ['', Validators.required],
  //     costcenter: ['', Validators.required],
  //     businessunit: ['', Validators.required],
  //     plant: ['', Validators.required]
  //   }));
  // }

  // removeItem(index: number): void {
  //   this.items.removeAt(index);
  // }

  // loadScenarios(): void {
  //   this.scenarioService.getScenarios().subscribe(
  //     (scenarios) => {
  //       this.scenarios. scenarios;
  //     },
  //     (error) => {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading scenarios' });
  //       console.error('Error loading scenarios:', error);
  //     }
  //   );
  // }

  loadShipPoints(): void {
    this.shippointService.getShipPoints().subscribe(
      (shippingPoints) => {
        this.shipPoints = shippingPoints;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading shipping points' });
        console.error('Error loading shipping points:', error);
      }
    );
  }

  onScenarioChange(): void {
    const scenarioIdControl = this.requestForm.get('scenarioId');
    this.selectedScenarioId.set(scenarioIdControl?.value ?? 0)
    // scenarioIdControl?.valueChanges.subscribe(scenarioId => {
    //   if (scenarioId) {
    //     this.scenarioService.getScenarioAttributes(scenarioId).subscribe(
    //       (attributes: any[]) => {
    //         this.scenarioAttributes = attributes;
    //         this.setFormValidators(attributes);
    //       },
    //       (error) => {
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading scenario attributes' });
    //         console.error('Error loading scenario attributes:', error);
    //       }
    //     );
    //   }
    // });
  }

  setFormValidators(attributes: any[]): void {
    attributes.forEach(attr => {
      const control = this.requestForm.get(attr.attributeName.toLowerCase());
      if (control) {
        if (attr.isMandatory) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
      // Handling item form group validators
      this.items.controls.forEach(itemGroup => {
        const itemControl = itemGroup.get(attr.attributeName.toLowerCase());
        if (itemControl) {
          if (attr.isMandatory) {
            itemControl.setValidators(Validators.required);
          } else {
            itemControl.clearValidators();
          }
          itemControl.updateValueAndValidity();
        }
      });
    });
  }

  isFieldRequired(attributeName: string): boolean {
    const attribute = this.scenarioAttributes.find(attr => attr.attributeName.toLowerCase() === attributeName.toLowerCase());
    return attribute ? attribute.isMandatory : false;
  }
  onSubmit(): void {
    console.log('request form: ', this.requestForm.value)

    // if (this.requestForm) {
    //   const userId = this.authService.getUserIdFromToken();
    //   const scenarioId = this.requestForm.value.scenarioId;
    //   if (typeof scenarioId === 'number') {
    //     const shippingPointId = this.shipPoints.find(point => point.id_ship === this.requestForm.value.shippingPoint)?.id_ship ?? 0;
    //     const deliveryAddressId = this.shipPoints.find(point => point.id_ship === this.requestForm.value.deliveryAddress)?.id_ship ?? 0;
    //     const requestData: CreateRequest = {
    //       invoicesTypes: this.requestForm.value.invoicesTypes,
    //       shipPointId: shippingPointId,
    //       deliveryAddressId: deliveryAddressId,
    //       incoterm: this.requestForm.value.incoterm,
    //       userId: userId,
    //       scenarioId: scenarioId,
    //       shippedvia: this.requestForm.value.shippedVia,
    //       dhlAccount: this.requestForm.value.dhlAccount,
    //       htsCode: this.requestForm.value.htsCode,
    //       coo: this.requestForm.value.coo,
    //       modeOfTransport: this.requestForm.value.modeOfTransport,
    //       trackingNumber: this.requestForm.value.trackingNumber,
    //       numberOfBoxes: this.requestForm.value.numberOfBoxes,
    //       weight: this.requestForm.value.weight ? Number(this.requestForm.value.weight) : null,
    //       dimension: this.requestForm.value.dimension,
    //       items: this.requestForm.value.items // Ajout des items au requestData
    //     };
    //     console.log('Request Data:', requestData);
    //     this.requestService.createRequest(requestData).subscribe(
    //       (response) => {
    //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request created successfully' });
    //         console.log('Request created:', response);
    //         this.dialogRef.close(response);
    //       },
    //       (error) => {
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating request' });
    //         console.error('Error creating request:', error);
    //       }
    //     );
    //   } else {
    //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Scenario ID is not a number' });
    //     console.error('Scenario ID is not a number');
    //   }
    // } else {
    //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Form is invalid' });
    //   console.error('Form is invalid');
    // }
  }


  getShippingPointName(id: number): string {
    return this.shipPoints.find(point => point.id_ship === id)?.fullAddress ?? 'Unknown';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onShippingOrDeliveryChange(): void {
    this.requestForm.get('shippingPoint')?.valueChanges.subscribe(() => this.checkShippingAndDelivery());
    this.requestForm.get('deliveryAddress')?.valueChanges.subscribe(() => this.checkShippingAndDelivery());
  }

  checkShippingAndDelivery(): void {
    const shippingPoint = this.requestForm.get('shippingPoint')?.value;
    const deliveryAddress = this.requestForm.get('deliveryAddress')?.value;

    if (shippingPoint && deliveryAddress) {
      this.updateIncoterm(shippingPoint, deliveryAddress);
    }
  }

  updateIncoterm(shippingPointId: number, deliveryAddressId: number): void {
    const shippingPoint = this.shipPoints.find(point => point.id_ship === shippingPointId);
    const deliveryAddress = this.shipPoints.find(point => point.id_ship === deliveryAddressId);

    if (shippingPoint?.isTe && deliveryAddress?.isTe) {
      this.requestForm.patchValue({ incoterm: 'FCA' });
    } else {
      this.requestForm.patchValue({ incoterm: '' });
    }

    // if (shippingPoint && deliveryAddress) {
    //   console.log('Shipping Point:', shippingPoint);
    //   console.log('Delivery Address:', deliveryAddress);
    // } else {
    //   console.log('Shipping Point or Delivery Address is not selected');
    // }

    // const validAddresses = ["MT10 TMED", "MT60 TAC1-ICT", "MT70 TAC1-AUT", "MT80 TAC2-IND", "MT30 TFZ"];

    // if (shippingPoint && deliveryAddress && validAddresses.includes(shippingPoint) && validAddresses.includes(deliveryAddress)) {
    //   this.requestForm.patchValue({ incoterm: 'FCA' });
    // } else {
    //   this.requestForm.patchValue({ incoterm: '' });
    // }
  }
}
