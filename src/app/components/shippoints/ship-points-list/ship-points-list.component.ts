import { Component, inject, model, OnInit } from '@angular/core';
import { DepartementService } from '../../../services/departement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { emptyShipPoint, ShipPointModel, shipPointTableColumns, shipPointTableProperties } from '../../../models/ship.model';
import { delay, filter, switchMap } from 'rxjs';
import { ShippointService } from '../../../services/shippoint.service';
import { TableNameEnum } from '../../../models/table.model';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HTTP_REQUEST_DELAY } from '../../../shared/constants/http-requests.constant';
import { ToasterService } from '../../../shared/services/toaster.service';
import { ShippointCrudComponent } from '../shippoint-crud/shippoint-crud.component';

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
  toastr = inject(ToasterService)

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
    if (!id) return
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: TableNameEnum.SHIP_POINT
      }
    })

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(() => this.shipPointService.deleteShipPoint(id))
    ).subscribe({
      next: () => {
        this.showSuccess('Ship Point Deleted successfully.')
        this.loadShipPoints();
      },
      error: () => {
        this.showError('Error in deleting ship point')
      }
    })
  }

  onUpdate(shipPoint: ShipPointModel): void {
    // this.shipPoint = shipPoint
    // this.displayUpdateDialog.set(true)

    const dialogRef = this.dialog.open(ShippointCrudComponent, {
      width: '800px',
      data: {
        isUpdateMode: true,
        shipPoint
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadShipPoints()
      }
    });

  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ShippointCrudComponent, {
      width: '800px',
      data: {
        isUpdateMode: false
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadShipPoints()
      }
    });
  }


  updateShipPoint(): void {
    this.shipPointService.updateShipPoint(this.shipPoint.id_ship, this.shipPoint).subscribe(
      () => {
        this.showSuccess('Ship Point updated successfully!');
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

  private showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

}
