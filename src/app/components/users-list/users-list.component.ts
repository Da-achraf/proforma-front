import { Component, inject, model, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { delay, filter, map, of, switchMap, tap } from 'rxjs';
import { TableNameEnum } from '../../models/table.model';
import { emptyUser, mainRoles, User, userTableColumns, userTableProperties } from '../../models/user/user.model';
import { DepartementService } from '../../services/departement.service';
import { PlantService } from '../../services/plant.service';
import { UserService } from '../../services/user.service';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HTTP_REQUEST_DELAY } from '../../shared/constants/http-requests.constant';
import { SideNavService } from '../../shared/services/side-nav.service';
import { ShippointService } from '../../services/shippoint.service';
import { Ship } from '../../models/ship.model';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService)
  departmentService = inject(DepartementService)
  plantService = inject(PlantService)
  shipPointService = inject(ShippointService)
  sideNavService = inject(SideNavService)
  dialog = inject(MatDialog)
  messageService = inject(MessageService)

  displayUpdateDialog = model(false)
  user: User = emptyUser

  // Observables
  users$ = this.userService.getUsers().pipe(
    delay(HTTP_REQUEST_DELAY)
  )
  departments$ = this.departmentService.getDepartements()
  plants$ = this.plantService.getPlants().pipe( 
    map((data: any[]) => {
      return data.map((plant) => ({
        label: plant.location as string,
        value: plant.id_plant as string
      }));
    })
  );
  shipPoints$ = this.shipPointService.getShipPoints().pipe( 
    map((data: any[]) => {
      return data.map((shipPoint: Ship) => ({
        label: shipPoint.shipPoint as string,
        value: shipPoint.id_ship
      }));
    })
  );
  roles$ = of(mainRoles)

  userTableProperties = userTableProperties
  userTableColumns = userTableColumns

  TableNameEnum = TableNameEnum

  ngOnInit(): void {
    this.loadUsers()
  }

  onUpdate(user: User): void {
    this.user = user
    this.user.plantsIds = user.plantsIds;
    this.user.shipPointsIds = user.shipPointsIds;
    this.user.departementId = user.departementId;
    this.displayUpdateDialog.set(true)
  }


  onDepartmentChange(event: any) {
    this.user.departementId = event.target.value;
  }

  loadPlants(): void {
    this.plants$ = this.plantService.getPlants().pipe( 
      map((data: any[]) => {
        return data.map((plant) => ({
          label: plant.location as string,
          value: plant.id_plant as string
        }));
      })
    );
  }

  loadShipPoints(): void {
    this.plants$ = this.plantService.getPlants().pipe( 
      map((data: any[]) => {
        return data.map((plant) => ({
          label: plant.location as string,
          value: plant.id_plant as string
        }));
      })
    );
  }

  loadUsers(): void {
    this.users$ = this.userService.getUsers().pipe(
      tap(this.sideNavService.users.set)
    )
  }

  updateUser(): void {
    const payload = {
      teId: this.user.teId,
      userName: this.user.userName,
      email: this.user.email,
      nPlus1: this.user.nPlus1,
      backUp: this.user.backUp,
      role: this.user.role,
      departementId: this.user.departementId,
      plantId: this.user.plantsIds,
      shipId: this.user.shipPointsIds,
    };

    console.log('Payload to update user:', payload);

    this.userService.updateUser(this.user.userId, payload).subscribe(
      () => {
        console.log('User updated successfully.');
        this.loadUsers();
        this.displayUpdateDialog.set(false);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
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
      switchMap(_ => this.userService.deleteUser(id))
    ).subscribe({
      next: () => {
        this.showSuccessMessage('User Deleted successfully.')
        this.loadUsers();
      },
      error: () => {
        this.showErrorMessage('Error in deleting ship point')
      }
    })
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
}
