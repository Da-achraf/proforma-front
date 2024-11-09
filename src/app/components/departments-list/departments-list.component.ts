import { Component, inject, model, OnInit } from '@angular/core';
import { DepartementService } from '../../services/departement.service';
import { Departement, departementTableColumns, departementTableProperties } from '../../models/user/departement';
import { TableNameEnum } from '../../models/table.model';
import { catchError, debounceTime, delay, filter, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HTTP_REQUEST_DELAY } from '../../shared/constants/http-requests.constant';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrl: './departments-list.component.css'
})
export class DepartmentsListComponent implements OnInit {

  departmentService = inject(DepartementService)
  messageService = inject(MessageService)
  snackBar = inject(MatSnackBar)
  fb = inject(FormBuilder)
  dialog = inject(MatDialog);

  displayUpdateDialog = model(false)
  displayCreateDialog = model(false)


  department: Departement = new Departement()
  createDepartementForm!: FormGroup
  managerControl = new FormControl()

  departments$ = this.departmentService.getDepartements().pipe(
    delay(HTTP_REQUEST_DELAY)
  )

  filtereddepartements: any[] = [];
  filteredManagers!: Observable<string[]>;

  tableProperties = departementTableProperties
  tableColumns = departementTableColumns
  TableNameEnum = TableNameEnum

  ngOnInit(): void {
    this.initializeForm()
    this.setupManagerAutocomplete()
  }

  loadDepartments() {
    this.departments$ = this.departmentService.getDepartements()
  }

  onDelete(id: number) {
    console.log('Opening dialog for department id: ', id)
    if (!id) return
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: TableNameEnum.DEPARTMENT
      }
    })

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(_ => this.departmentService.deleteDepartement(id))
    ).subscribe({
      next: () => {
        this.showSuccessMessage('Departement Deleted successfully.')
        this.loadDepartments();
      },
      error: () => {
        this.showErrorMessage('Error in deleting departement')
      }
    })
  }

  onUpdate(departement: Departement): void {
    this.department = departement
    this.displayUpdateDialog.set(true)
  }

  onCreate(): void {
    this.createDepartementForm.reset()
    this.displayCreateDialog.set(true)
  }

  updateDepartement(): void {
    this.departmentService.updateDepartement(this.department.id_departement, this.department).subscribe(
      () => {
        this.showSuccessMessage('Departement updated successfully.')
        this.displayUpdateDialog.set(false)
        this.loadDepartments();
      },
      (error) => {
        this.showErrorMessage('Error updating department.')
        console.error('Error updating departement:', error);
      }
    );
  }

  createDepartment() {
    if (this.createDepartementForm.valid) {
      const newDepartement: Departement = {
        id_departement: 0,  
        name: this.createDepartementForm.value.name,
        manager: this.createDepartementForm.value.manager,
        
      };

      this.departmentService.createDepartement(newDepartement).subscribe({
        next: (response) => {
          this.showSuccessMessage('Department successfully created!');
          this.resetFormAndNavigate();
        },
        error: (error) => {
          this.showErrorMessage('Error creating department.')
        }
      });
    } else {
      console.log('Formulaire invalide', this.createDepartementForm);
    }
  }

  private resetFormAndNavigate() {
    this.createDepartementForm.reset();
    this.displayCreateDialog.set(false)
    this.loadDepartments();
  }

  private initializeForm() {
    this.createDepartementForm = this.fb.group({
      name: ['', Validators.required],
      manager: this.managerControl,
    });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  setupManagerAutocomplete() {
    this.filteredManagers = this.managerControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      tap(value => console.log("Querying for:", value)),
      switchMap(value => {
        if (!value) return of([]);
        return this.departmentService.searchManagers(value).pipe(
          catchError(err => {
            console.error('Error fetching managers:', err);
            this.showErrorMessage('Error fetching managers');
            return of([]);
          })
        );
      })
    );
  }
}
