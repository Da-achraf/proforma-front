import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { emptyUser, RoleEnum, Roles, User } from '../../models/user/user.model';
import { Router } from '@angular/router';
import { DepartementService } from '../../services/departement.service';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-listofusers',
  templateUrl: './listofusers.component.html',
  styleUrls: ['./listofusers.component.css']
})
export class ListOfUsersComponent implements OnInit {

  protected RoleEnum = RoleEnum
  protected Roles = Roles

  users: User[] | undefined = undefined;
  user: User = emptyUser
  page: number = 1;
  tableSize: number = 7;
  SearchText: string = ''; // Propriété pour stocker le texte de recherche
  filteredUsers: User[]|undefined = undefined;
  displayUpdateDialog: boolean = false;
  plants: any[] = [];
  departements: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private departementService: DepartementService,
    private plantService: PlantService
  ) {
  }

  //********start pagination********* //
  onPageChange(page: number) {
    this.page = page;
  }

  getPageNumbers(): number[] {
    const usersLength = this.filteredUsers?.length as number
    const pageCount = Math.ceil(usersLength / this.tableSize);
    return Array(pageCount).fill(0).map((x, i) => i + 1);
  }
  //********end pagination********* //
  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartements();
    this.loadPlants();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = this.users.slice(); // Initialize filteredUsers with all users

        console.log('Loaded users: ', this.users)
      },
      error: (error: any) => {
        console.log('Error fetching users:', error);
      }
    });
  }

  deleteUser(userId: number | undefined): void {
    if (!userId) {
      console.log('User ID is undefined or null.');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.loadUsers();
        },
        (error) => {
          console.log('Error deleting user:', error);
        }
      );
    }
  }

  showUpdateDialog(user: User): void {
    this.userService.getUserById(user.userId).subscribe({
      next: (data: User) => {
        this.user = data
        this.user.plantsIds = data.plantsIds;
        this.user.departementId = user.departementId;
        this.displayUpdateDialog = true;
        console.log('User to update:', this.user);
        console.log('Loaded departments in showUpdateDialog:', this.departements);
      },
      error: (error: any) => {
        console.log('Error fetching user by ID:', error);
      }
    });
  }

  saveUser(): void {
    // Construire le payload dans le format spécifié
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
        this.displayUpdateDialog = false;
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  onDepartmentChange(event: any) {
    console.log('Department selected:', event.target.value);
    this.user.departementId = event.target.value;
    console.log('Updated user with new departmentId:', this.user.departementId);
  }

  searchUser() {
    if (this.SearchText.trim() === '') {
      this.filteredUsers = this.users?.slice();
    } else {
      this.filteredUsers = this.users?.filter(user =>
        user.userName.toLowerCase().includes(this.SearchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.SearchText.toLowerCase())
      );
    }
    console.log("Filtered Users: ", this.filteredUsers);
  }

  loadPlants(): void {
    this.plantService.getPlants().subscribe(
      (plants) => {
        this.plants = plants.map((plant) => ({
          label: plant.location,
          value: plant.id_plant
        }));
        console.log('Loaded plants:', this.plants);
      },
      (error) => {
        console.error('Erreur lors du chargement des plantes:', error);
      }
    );
  }

  loadDepartements(): void {
    this.departementService.getDepartements().subscribe(
      (departements) => {
        this.departements = departements.map((department) => ({
          label: department.name,
          value: department.id_departement
        }));
        console.log('Loaded departments:', this.departements);
      },
      (error) => {
        console.error('Erreur lors du chargement des départements:', error);
      }
    );
  }

}
