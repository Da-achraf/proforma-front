import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Departement } from '../../models/user/departement';
import { DepartementService } from '../../services/departement.service';
import { PlantService } from '../../services/plant.service';
import { Plant } from '../../models/user/plant.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {
  Repeatpass: string = 'none';
  displayMsg: string = '';
  isAccountCreated: boolean = false;
  departements: any[] = [];
  plants: any[] = [];
  SignUpForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private departementservice: DepartementService,
    private plantService: PlantService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('test: ', this.authService.baseServerUrl)
    this.loadPlants();
    this.loadDepartements();
    this.initializeForm();
  }

  loadPlants() {
    this.plantService.getPlants().subscribe(
      (plants) => {
        this.plants = plants.map((plant) => ({
          label: plant.location,
          value: plant.id_plant
        }));
        console.log('Loaded plants:', this.plants); // Log loaded plants
      },
      (error) => {
        console.error('Erreur lors du chargement des plantes:', error);
        this.showErrorMessage('Error when loading plants: ' + error);
      }
    );
  }

  loadDepartements() {
    this.departementservice.getDepartements().subscribe(
      (departements) => {
        this.departements = departements;
        console.log('Loaded departments:', this.departements); // Log loaded departments
      },
      (error) => {
        console.error('Erreur lors du chargement des départements:', error);
        this.showErrorMessage('Error when loading departments: ' + error);
      }
    );
  }

  showErrorMessage(message: string) {
    this.displayMsg = message;
    this.isAccountCreated = false;
  }

  private initializeForm() {
    this.SignUpForm = this.fb.group({
      teId: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departementId: ['', Validators.required],
      nPlus1: [''],
      backup: ['', Validators.required],
      role: [''],
      yourpassword: ['', [Validators.required, Validators.minLength(8)]],
      plantId: [[], Validators.required]
    });
  }

  get teId(): FormControl {
    return this.SignUpForm.get('teId') as FormControl;
  }
  get username(): FormControl {
    return this.SignUpForm.get('username') as FormControl;
  }
  get email(): FormControl {
    return this.SignUpForm.get('email') as FormControl;
  }
  get departementId(): FormControl {
    return this.SignUpForm.get('departementId') as FormControl;
  }
  get plantId(): FormArray {
    return this.SignUpForm.get('plantId') as FormArray;
  }
  get nPlus1(): FormControl {
    return this.SignUpForm.get('nPlus1') as FormControl;
  }
  get backup(): FormControl {
    return this.SignUpForm.get('backup') as FormControl;
  }
  get yourpassword(): FormControl {
    return this.SignUpForm.get('yourpassword') as FormControl;
  }

  SignUpSubmited() {
    if (this.SignUpForm.valid) {
      const plantId = this.SignUpForm.get('plantId')!.value.map((plant: { value: number }) => plant.value);

      const userPayload = {
        // user: {
          teId: this.SignUpForm.value.teId,
          userName: this.SignUpForm.value.username,
          email: this.SignUpForm.value.email,
          nPlus1: this.SignUpForm.value.nPlus1 || null,
          backUp: this.SignUpForm.value.backup,
          role: this.SignUpForm.value.role || null,
          pwd: this.SignUpForm.get('yourpassword')!.value,
          departementId: Number(this.SignUpForm.value.departementId),
          plants: plantId
        // },
        // plantId: plantId // array of numbers
      };

      console.log('Payload to send:', JSON.stringify(userPayload, null, 2)); // Good for debugging

      this.authService.SignUpUser(userPayload).subscribe({
        next: (response) => {
          console.log('User created successfully', response);
          alert('Account successfully created!');
          this.displayMsg = 'Account successfully created!';
          this.isAccountCreated = true;
          this.resetFormAndNavigate();
        },
        error: (error) => {
          console.error('Error creating user', error);
          this.displayMsg = 'Failed to create account: ' + error.message;
          this.isAccountCreated = false;
        }
      });
    }
  }

  resetFormAndNavigate() {
    this.SignUpForm.reset(); // Reset the form state and values
    this.router.navigateByUrl('/sign-up');
  }
}
