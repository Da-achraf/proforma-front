import { Component } from '@angular/core';
import { Departement } from '../../models/user/departement';
import { Router } from '@angular/router';
import { DepartementService } from '../../services/departement.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, startWith, tap, switchMap, of, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-listofdepartements',
  templateUrl: './listofdepartements.component.html',
  styleUrl: './listofdepartements.component.css'
})
export class ListofdepartementsComponent {
  departements: Departement[] = [];
  departement: Departement = new Departement();
  newDepartement: Departement = new Departement(); // For the create departement form
  page: number = 1;
  tableSize: number = 7;
  SearchText: string = ''; // Propriété pour stocker le texte de recherche
  filtereddepartements: any[] = [];
  displayUpdateDialog: boolean = false;
  displayCreateDialog: boolean = false;
  managerControl = new FormControl();
  filteredManagers!: Observable<string[]>;
  createDepartementForm!: FormGroup;

  constructor(
    private departementService: DepartementService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadDepartements();
    this.setupManagerAutocomplete();
    this.initializeForm();
  }

  loadDepartements(): void {
    this.departementService.getDepartements().subscribe({
      next: (data: Departement[]) => {
        this.departements = data;
        this.filtereddepartements = this.departements.slice();
      },
      error: (error: any) => {
        console.log('Error fetching Departements:', error);
      }
    });
  }

  deleteDepartement(id_departement: number | undefined): void {
    if (!id_departement) {
      console.log('Departement ID is undefined or null.');
      return;
    }

    if (confirm('Are you sure you want to delete this departement?')) {
      this.departementService.deleteDepartement(id_departement).subscribe(
        () => {
          this.loadDepartements();
        },
        (error) => {
          console.log('Error deleting Departement:', error);
        }
      );
    }
  }

  showUpdateDialog(departement: Departement) {
    this.departement = departement;
    this.displayUpdateDialog = true;
  }

  saveDepartement(): void {
    this.departementService.updateDepartement(this.departement.id_departement, this.departement).subscribe(
      () => {
        console.log('Departement updated successfully.');
        this.displayUpdateDialog = false;
        this.loadDepartements();
      },
      (error) => {
        console.error('Error updating departement:', error);
      }
    );
  }

  showCreateDialog() {
    this.newDepartement = new Departement();
    this.displayCreateDialog = true;
  }

  save() {
    if (this.createDepartementForm.valid) {
      const newDepartement: Departement = {
        id_departement: 0,  
        name: this.createDepartementForm.value.name,
        manager: this.createDepartementForm.value.manager,
        
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
    this.displayCreateDialog = false;
    this.loadDepartements();
  }

  private initializeForm() {
    this.createDepartementForm = this.fb.group({
      name: ['', Validators.required],
      manager: this.managerControl,
    });
  }

  setupManagerAutocomplete() {
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

  searchUser() {
    if (this.SearchText.trim() === '') {
      this.filtereddepartements = this.departements.slice();
    } else {
      this.filtereddepartements = this.departements.filter(departement =>
        departement.manager.toLowerCase().includes(this.SearchText.toLowerCase()) ||
        departement.name.toLowerCase().includes(this.SearchText.toLowerCase())
      );
    }
  }

  onPageChange(page: number) {
    this.page = page;
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.filtereddepartements.length / this.tableSize);
    return Array(pageCount).fill(0).map((x, i) => i + 1);
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
}
