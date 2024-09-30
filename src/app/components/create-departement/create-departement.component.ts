import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DepartementService } from '../../services/departement.service';
import { PlantService } from '../../services/plant.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, catchError, startWith, tap } from 'rxjs/operators';
import { Departement } from '../../models/user/departement';

@Component({
  selector: 'app-create-departement',
  templateUrl: './create-departement.component.html',
  styleUrls: ['./create-departement.component.scss']
})
export class CreateDepartementComponent implements OnInit {
  createDepartementForm!: FormGroup;
  managerControl = new FormControl();
  filteredManagers!: Observable<string[]>;
  departement: Departement = new Departement();

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupManagerAutocomplete();
  }

  private initializeForm() {
    this.createDepartementForm = this.fb.group({
      name: ['', Validators.required],
      manager: this.managerControl,
    });
  }


  private setupManagerAutocomplete() {
    this.filteredManagers = this.managerControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      tap(value => console.log("Querying for:", value)),
      switchMap(value => {
        if (!value) return of([]);
        return this.departementService.searchManagers(value).pipe(
          catchError(err => {
            console.error('Error fetching managers:', err);
            this.showErrorMessage('Error fetching managers');
            return of([]);
          })
        );
      })
    );
  }

  save() {
    if (this.createDepartementForm.valid) {
      const newDepartement: Departement = {
        name: this.createDepartementForm.value.name,
        manager: this.createDepartementForm.value.manager,
        id_departement: 0
      };

      console.log('Payload à envoyer :', JSON.stringify(newDepartement, null, 2));

      this.departementService.createDepartement(newDepartement).subscribe({
        next: (response) => {
          console.log('Département créé avec succès', response);
          this.showSuccessMessage('Department successfully created!');
          this.resetFormAndNavigate();
        },
        error: (error) => {
          console.error('Erreur lors de la création du département', error);
          this.showErrorMessage('Failed to create department: ' + error.message);
        }
      });
    } else {
      console.log('Formulaire invalide', this.createDepartementForm);
    }
  }


  private resetFormAndNavigate() {
    this.createDepartementForm.reset();
    this.router.navigateByUrl('/departementmanagement');
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['green-snackbar']
    });
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  returnClicked() {
    this.router.navigate(['/departementmanagement']);
  }
}
