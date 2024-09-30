import { Component } from '@angular/core';
import { PlantService } from '../../services/plant.service';
import { Router } from '@angular/router';
import { Plant } from '../../models/user/plant.model';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, startWith, tap, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-listofplants',
  templateUrl: './listofplants.component.html',
  styleUrl: './listofplants.component.css'
})
export class ListofplantsComponent {
  plants: Plant[] = [];
  plant: Plant = new Plant();
  newPlant: Plant = new Plant(); // For the create plant form
  page: number = 1;
  tableSize: number = 7;
  SearchText: string = ''; // Propriété pour stocker le texte de recherche
  filteredplants: any[] = [];
  displayUpdateDialog: boolean = false;
  displayCreateDialog: boolean = false;
  managerControl = new FormControl();
  filteredManagerPlants!: Observable<string[]>;

  constructor(private plantservice: PlantService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlants();
    this.setupManagerAutocomplete();
  }

  loadPlants(): void {
    this.plantservice.getPlants().subscribe({
      next: (data: Plant[]) => {
        this.plants = data;
        this.filteredplants = this.plants.slice();
      },
      error: (error: any) => {
        console.log('Error fetching plants:', error);
      }
    });
  }

  deletePlant(id_plant: number | undefined): void {
    if (!id_plant) {
      console.log('Plant ID is undefined or null.');
      return;
    }

    if (confirm('Are you sure you want to delete this plant?')) {
      this.plantservice.deletePlant(id_plant).subscribe(
        () => {
          this.loadPlants();
        },
        (error) => {
          console.log('Error deleting plant:', error);
        }
      );
    }
  }

  showUpdateDialog(plant: Plant) {
    this.plant = plant;
    this.displayUpdateDialog = true;
  }

  savePlant(): void {
    this.plantservice.updatePlant(this.plant.id_plant, this.plant).subscribe(
      () => {
        console.log('Plant updated successfully.');
        this.displayUpdateDialog = false;
        this.loadPlants();
      },
      (error) => {
        console.error('Error updating plant:', error);
      }
    );
  }

  showCreateDialog() {
    this.newPlant = new Plant();
    this.displayCreateDialog = true;
  }

  createPlant(): void {
    this.plantservice.savePlant(this.newPlant).subscribe(
      () => {
        console.log('Plant registered successfully.');
        this.displayCreateDialog = false;
        this.loadPlants();
        this.newPlant = new Plant(); // Reset the form
      },
      (error) => {
        console.error('Error registering plant:', error);
      }
    );
  }

  searchPlant() {
    if (this.SearchText.trim() === '') {
      this.filteredplants = this.plants.slice();
    } else {
      this.filteredplants = this.plants.filter(plant =>
        plant.location.toLowerCase().includes(this.SearchText.toLowerCase()) ||
        plant.manager_plant.toLowerCase().includes(this.SearchText.toLowerCase())
      );
    }
  }

  setupManagerAutocomplete() {
    this.filteredManagerPlants = this.managerControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      tap(value => console.log("Querying for:", value)),
      switchMap(value => {
        if (!value) return of([]);
        return this.plantservice.searchManagerPlants(value).pipe(
          catchError(err => {
            console.error('Error fetching managers:', err);
            return of([]);
          })
        );
      })
    );
  }

  onPageChange(page: number) {
    this.page = page;
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.filteredplants.length / this.tableSize);
    return Array(pageCount).fill(0).map((x, i) => i + 1);
  }
}
