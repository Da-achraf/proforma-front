import { AsyncPipe } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import {
  catchError,
  debounceTime,
  delay,
  filter,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TableNameEnum } from '../../core/models/table.model';
import {
  Departement,
  departementTableColumns,
  departementTableProperties,
} from '../../core/models/user/departement';
import { DepartementService } from '../../services/departement.service';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ManagementTablesComponent } from '../../shared/components/management-tables/management-tables.component';
import { HTTP_REQUEST_DELAY } from '../../shared/constants/http-requests.constant';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrl: './departments-list.component.css',
  imports: [
    ManagementTablesComponent,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
})
export class DepartmentsListComponent implements OnInit {
  departmentService = inject(DepartementService);
  messageService = inject(MessageService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);

  displayUpdateDialog = model(false);
  displayCreateDialog = model(false);

  department: Departement = new Departement();
  createDepartementForm!: FormGroup;
  managerControl = new FormControl();

  departments$ = this.departmentService
    .getDepartements()
    .pipe(delay(HTTP_REQUEST_DELAY));

  filtereddepartements: any[] = [];
  filteredManagers!: Observable<string[]>;

  tableProperties = departementTableProperties;
  tableColumns = departementTableColumns;
  TableNameEnum = TableNameEnum;

  ngOnInit(): void {
    this.initializeForm();
    this.setupManagerAutocomplete();
  }

  loadDepartments() {
    this.departments$ = this.departmentService.getDepartements();
  }

  onDelete(id: number) {
    console.log('Opening dialog for department id: ', id);
    if (!id) return;
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        label: TableNameEnum.DEPARTMENT,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap((_) => this.departmentService.deleteDepartement(id)),
      )
      .subscribe({
        next: () => {
          this.showSuccess('Departement Deleted successfully.');
          this.loadDepartments();
        },
        error: () => {
          this.showError('Error in deleting departement');
        },
      });
  }

  onUpdate(departement: Departement): void {
    this.department = departement;
    this.displayUpdateDialog.set(true);
  }

  onCreate(): void {
    this.createDepartementForm.reset();
    this.displayCreateDialog.set(true);
  }

  updateDepartement(): void {
    this.departmentService
      .updateDepartement(this.department.id_departement, this.department)
      .subscribe(
        () => {
          this.showSuccess('Departement updated successfully.');
          this.displayUpdateDialog.set(false);
          this.loadDepartments();
        },
        (error) => {
          this.showError('Error updating department.');
          console.error('Error updating departement:', error);
        },
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
          this.showSuccess('Department successfully created!');
          this.resetFormAndNavigate();
        },
        error: (error) => {
          this.showError('Error creating department.');
        },
      });
    } else {
      console.log('Formulaire invalide', this.createDepartementForm);
    }
  }

  private resetFormAndNavigate() {
    this.createDepartementForm.reset();
    this.displayCreateDialog.set(false);
    this.loadDepartments();
  }

  private initializeForm() {
    this.createDepartementForm = this.fb.group({
      name: ['', Validators.required],
      manager: this.managerControl,
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  setupManagerAutocomplete() {
    this.filteredManagers = this.managerControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      tap((value) => console.log('Querying for:', value)),
      switchMap((value) => {
        if (!value) return of([]);
        return this.departmentService.searchManagers(value).pipe(
          catchError((err) => {
            console.error('Error fetching managers:', err);
            this.showError('Error fetching managers');
            return of([]);
          }),
        );
      }),
    );
  }
}
