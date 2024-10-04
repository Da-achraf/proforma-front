import { AfterViewInit, Component, inject, model, OnInit } from '@angular/core';
import { PlantService } from '../../services/plant.service';
import { DepartementService } from '../../services/departement.service';
import { catchError, debounceTime, delay, filter, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Roles } from '../../models/user/user.model';
import { Plant, PlantModel, plantTableColumns, plantTableProperties } from '../../models/user/plant.model';
import { TableNameEnum } from '../../models/table.model';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-plants-list',
  templateUrl: './plants-list.component.html',
  styleUrl: './plants-list.component.css'
})
export class PlantsListComponent implements AfterViewInit, OnInit {

  departmentService = inject(DepartementService)
  plantService = inject(PlantService)
  dialog = inject(MatDialog)
  messageService = inject(MessageService)

  managerControl = new FormControl();
  filteredManagerPlants!: Observable<string[]>;

  displayUpdateDialog = model(false)
  displayCreateDialog = model(false)

  // Observables
  plants$ = this.plantService.getPlants().pipe(
    delay(1000),
  );
  departments$ = this.departmentService.getDepartements()

  roles$ = of(Roles)

  plant: Plant = new Plant()
  newPlant: Plant = new Plant(); // For the create plant form

  tableProperties = plantTableProperties
  tableColumns = plantTableColumns
  TableNameEnum = TableNameEnum

  ngOnInit(): void {
    this.setupManagerAutocomplete()
  }

  ngAfterViewInit(): void {
    this.plant = new Plant()
  }

  loadPlants(): void {
    this.plants$ = this.plantService.getPlants()
  }

  onUpdate(plant: Plant): void {
    this.plant = plant
    this.displayUpdateDialog.set(true)
  }

  onDelete(id: number) {
    if (!id) return
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: TableNameEnum.USER
      }
    })

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(_ => this.plantService.deletePlant(id))
    ).subscribe({
      next: () => {
        this.showSuccessMessage('User Deleted successfully.')
        this.loadPlants();
      },
      error: () => {
        this.showErrorMessage('Error in deleting ship point')
      }
    })
  }


  savePlant(): void {
    this.plantService.updatePlant(this.plant.id_plant, this.plant).subscribe(
      () => {
        console.log('Plant updated successfully.');
        this.displayUpdateDialog.set(false);
        this.loadPlants();
      },
      (error) => {
        console.error('Error updating plant:', error);
      }
    );
  }

  onCreate(): void {
    this.displayCreateDialog.set(true)
  }

  createPlant() {
    this.plantService.savePlant(this.newPlant).subscribe(
      () => {
        console.log('Plant registered successfully.');
        this.displayCreateDialog.set(false)
        this.loadPlants();
        this.newPlant = new Plant(); // Reset the form
      },
      (error) => {
        console.error('Error registering plant:', error);
      }
    );
  }

  setupManagerAutocomplete() {
    this.filteredManagerPlants = this.managerControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      tap(value => console.log("Querying for:", value)),
      switchMap(value => {
        if (!value) return of([]);
        return this.plantService.searchManagerPlants(value).pipe(
          catchError(err => {
            console.error('Error fetching managers:', err);
            return of([]);
          })
        );
      })
    );
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
}
