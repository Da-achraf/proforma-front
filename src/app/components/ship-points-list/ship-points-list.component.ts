import { Component, inject, model, OnInit } from '@angular/core';
import { DepartementService } from '../../services/departement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { emptyShipPoint, ShipPointModel, shipPointTableColumns, shipPointTableProperties } from '../../models/ship.model';
import { delay, filter, switchMap } from 'rxjs';
import { ShippointService } from '../../services/shippoint.service';
import { TableNameEnum } from '../../models/table.model';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HTTP_REQUEST_DELAY } from '../../shared/constants/http-requests.constant';

@Component({
  selector: 'app-ship-points-list',
  templateUrl: './ship-points-list.component.html',
  styleUrl: './ship-points-list.component.css'
})
export class ShipPointsListComponent implements OnInit {

  shipPointService = inject(ShippointService)
  snackBar = inject(MatSnackBar)
  messageService = inject(MessageService)
  fb = inject(FormBuilder)
  dialog = inject(MatDialog)

  displayUpdateDialog = model(false)
  displayCreateDialog = model(false)

  shipPoint: ShipPointModel = emptyShipPoint
  createShipPointForm!: FormGroup

  shipPoints$ = this.shipPointService.getShipPoints().pipe(
    delay(HTTP_REQUEST_DELAY)
  )

  tableProperties = shipPointTableProperties
  tableColumns = shipPointTableColumns
  TableNameEnum = TableNameEnum

  ngOnInit(): void {
    this.initializeForm()
  }

  loadShipPoints() {
    this.shipPoints$ = this.shipPointService.getShipPoints()
  }

  private initializeForm() {
    this.createShipPointForm = this.fb.group({
      shipPoint: ['', Validators.required],
      fullAddress: ['', Validators.required],
      isTe: [true]
    });
  }

  onDelete(id: number) {
    console.log('Opening dialog for department id: ', id)
    if (!id) return
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: TableNameEnum.SHIP_POINT
      }
    })

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap((id: number) => this.shipPointService.deleteShipPoint(id))
    ).subscribe({
      next: () => {
        this.showSuccessMessage('Ship Point Deleted successfully.')
        this.loadShipPoints();
      },
      error: () => {
        this.showErrorMessage('Error in deleting ship point')
      }
    })
  }

  onUpdate(shipPoint: ShipPointModel): void {
    this.shipPoint = shipPoint
    this.displayUpdateDialog.set(true)
  }

  onCreate(): void {
    this.createShipPointForm.reset()
    this.displayCreateDialog.set(true)
  }

  createShipPoint() {
    if (this.createShipPointForm.valid) {
      const newShipPoint: ShipPointModel = {
        id_ship: 0,  
        shipPoint: this.createShipPointForm.value.shipPoint,
        fullAddress: this.createShipPointForm.value.fullAddress,
        isTe: this.createShipPointForm.value.isTe
      };

      this.shipPointService.CreateShipPoint(newShipPoint).subscribe({
        next: (response) => {
          this.showSuccessMessage('Ship Point successfully created!');
          this.resetFormAndNavigate();
        },
        error: (error) => {
          this.showErrorMessage('Failed to create ship point: ' + error.message);
        }
      });
    } else {
      console.log('Formulaire invalide', this.createShipPointForm);
    }
  }

  updateShipPoint(): void {
    this.shipPointService.updateShipPoint(this.shipPoint.id_ship, this.shipPoint).subscribe(
      () => {
        this.showSuccessMessage('Ship Point updated successfully!');
        this.displayUpdateDialog.set(false)
        this.loadShipPoints();
      },
      (error) => {
        console.error('Error updating departement:', error);
      }
    );
  }

  private resetFormAndNavigate() {
    this.createShipPointForm.reset();
    this.displayCreateDialog.set(false)
    this.loadShipPoints();
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

}
