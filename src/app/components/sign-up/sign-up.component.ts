import { NgClass } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { pureRoles } from '../../core/models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { DepartementService } from '../../services/departement.service';
import { PlantService } from '../../services/plant.service';
import { ShippointService } from '../../services/shippoint.service';
import { UserService } from '../../services/user.service';
import { UserRoleForDisplayPipe } from '../../shared/pipes/user-role-for-display.pipe';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    NgClass,
    UserRoleForDisplayPipe,
    RouterLink,
  ],
})
export class SignUpComponent implements OnInit {
  Repeatpass: string = 'none';
  displayMsg: string = '';
  isAccountCreated: boolean = false;
  departements: any[] = [];
  plants: any[] = [];
  shipPoints: any[] = [];
  SignUpForm!: FormGroup;

  passwordFieldType: string = 'password';

  roles = pureRoles;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private departementservice: DepartementService,
    private plantService: PlantService,
    private shipPointService: ShippointService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('test: ', this.authService.baseServerUrl);
    this.loadPlants();
    this.loadShipPoints();
    this.loadDepartements();
    this.initializeForm();
  }

  loadPlants() {
    this.plantService.getPlants().subscribe(
      (plants) => {
        this.plants = plants.map((plant) => ({
          label: plant.location,
          value: plant.id_plant,
        }));
        console.log('Loaded plants:', this.plants); // Log loaded plants
      },
      (error) => {
        console.error('Erreur lors du chargement des plantes:', error);
        this.showError('Error when loading plants: ' + error);
      },
    );
  }

  loadShipPoints() {
    this.shipPointService.getShipPoints().subscribe(
      (shipPoints) => {
        this.shipPoints = shipPoints.map((shipPoint) => ({
          label: shipPoint.shipPoint,
          value: shipPoint.id_ship,
        }));
        console.log('Loaded ship points:', this.shipPoints); // Log loaded plants
      },
      (error) => {
        console.error('Erreur lors du chargement des plantes:', error);
        this.showError('Error when loading plants: ' + error);
      },
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
        this.showError('Error when loading departments: ' + error);
      },
    );
  }

  showError(message: string) {
    this.displayMsg = message;
    this.isAccountCreated = false;
  }

  private initializeForm() {
    this.SignUpForm = this.fb.group({
      teId: ['', [Validators.required, Validators.pattern(/^TE\d{6}$/)]],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departementId: ['', Validators.required],
      nPlus1: [''],
      backup: ['', [Validators.required, Validators.email]],
      role: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      plantId: [[]],
      shipId: [[], Validators.required],
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
  get role(): FormControl {
    return this.SignUpForm.get('role') as FormControl;
  }
  get departementId(): FormControl {
    return this.SignUpForm.get('departementId') as FormControl;
  }
  get plantId(): FormArray {
    return this.SignUpForm.get('plantId') as FormArray;
  }

  get shipId(): FormArray {
    return this.SignUpForm.get('shipId') as FormArray;
  }

  get nPlus1(): FormControl {
    return this.SignUpForm.get('nPlus1') as FormControl;
  }
  get backup(): FormControl {
    return this.SignUpForm.get('backup') as FormControl;
  }
  get password(): FormControl {
    return this.SignUpForm.get('password') as FormControl;
  }

  SignUpSubmited() {
    if (this.SignUpForm.valid) {
      const plantId =
        this.SignUpForm.get('plantId')!.value?.map(
          (plant: { value: number }) => plant.value,
        ) ?? [];
      const shipId =
        this.SignUpForm.get('shipId')!.value.map(
          (ship: { value: number }) => ship.value,
        ) ?? [];

      const userPayload = {
        // user: {
        teId: this.SignUpForm.value.teId,
        userName: this.SignUpForm.value.username,
        email: this.SignUpForm.value.email,
        nPlus1: this.SignUpForm.value.nPlus1 || null,
        backUp: this.SignUpForm.value.backup,
        role: this.SignUpForm.value.role || null,
        pwd: this.SignUpForm.get('password')!.value,
        departementId: Number(this.SignUpForm.value.departementId),
        plants: plantId,
        shipPoints: shipId,
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
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  resetFormAndNavigate() {
    this.SignUpForm.reset(); // Reset the form state and values
    this.router.navigateByUrl('/sign-up');
  }
}
