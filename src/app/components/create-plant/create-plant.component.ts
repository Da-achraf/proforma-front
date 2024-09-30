import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Plant } from '../../models/user/plant.model';
import { PlantService } from '../../services/plant.service';
import { FormControl } from '@angular/forms';
import { Observable, startWith, switchMap, debounceTime, catchError, of,tap } from 'rxjs';

@Component({
  selector: 'app-create-plant',
  templateUrl: './create-plant.component.html',
  styleUrl: './create-plant.component.scss'
})
export class CreatePlantComponent implements OnInit {
  plant: Plant = new Plant();
  returnButtonClicked = false;
  managerControl = new FormControl();
  filteredManagerPlants!: Observable<string[]>;

  constructor(private http: HttpClient, private plantservice: PlantService, private router: Router, private snackBar: MatSnackBar) {}
  
  ngOnInit() {
    this.setupManagerAutocomplete();
  }

  setupManagerAutocomplete() {
    this.filteredManagerPlants = this.managerControl.valueChanges.pipe(
      debounceTime(300), // Delay to prevent flooding requests
      startWith(''), // Start with empty string
      tap(value => console.log("Querying for:", value)), // Debug output
      switchMap(value => {
        if (!value) return of([]); // Return empty if no value
        return this.plantservice.searchManagerPlants(value)
          .pipe(
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
    console.log(this.plant);
    if (!this.returnButtonClicked) {
      this.plantservice.savePlant(this.plant)
        .subscribe(
          response => {
            console.log('Enregistrement du plant réussi :', response);
            this.showErrorMessage('Successful plant registration');

          },
          error => {
            console.error('Erreur lors de l\'enregistrement du plant :', error);
            this.showErrorMessage('Error when saving plant : ' + error);
        
          }
        );
      this.plant = new Plant;

    }
  }

  returnClicked() {
    this.returnButtonClicked = true;
    this.router.navigate(["/plantmanagement"])
  }
  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
