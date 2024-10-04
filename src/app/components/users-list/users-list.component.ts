import { Component, inject, model, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { emptyUser, Roles, User, userTableColumns, userTableProperties } from '../../models/user/user.model';
import { TableNameEnum } from '../../models/table.model';
import { defaultIfEmpty, delay, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { DepartementService } from '../../services/departement.service';
import { PlantService } from '../../services/plant.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  userService = inject(UserService)
  departmentService = inject(DepartementService)
  plantService = inject(PlantService)
  dialog = inject(MatDialog)
  messageService = inject(MessageService)

  displayUpdateDialog = model(false)
  user: User = emptyUser

  // Observables
  users$ = this.userService.getUsers().pipe(
    delay(1000)
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
  roles$ = of(Roles)

  userTableProperties = userTableProperties
  userTableColumns = userTableColumns

  TableNameEnum = TableNameEnum

  onUpdate(user: User): void {
    this.user = user
    this.user.plantsIds = user.plantsIds;
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

  loadUsers(): void {
    this.users$ = this.userService.getUsers()
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
      plantId: this.user.plantsIds
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
