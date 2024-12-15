import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrl: './parcels.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class ParcelsComponent implements OnInit, OnDestroy {

  parentContainer = inject(ControlContainer)

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup
  }

  get boxes() {
    return this.parentFormGroup.controls['boxes']
  }

  get pallets() {
    return this.parentFormGroup.controls['pallets']
  }


  ngOnInit(): void {
    this.parentFormGroup.addControl('boxes', new FormControl(0, [Validators.required]))
    this.parentFormGroup.addControl('pallets', new FormControl(0, [Validators.required]))
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl('boxes')
    this.parentFormGroup.removeControl('pallets')
  }
}
