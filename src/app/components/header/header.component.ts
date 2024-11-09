import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  userStore = inject(UserStoreService)

  public fullName: string = " ";
  public users: any = [];
  public role!: string;
  public items: MenuItem[] = [];

  constructor(private router: Router,
              private api: UserService,
              private authservice: AuthService) { }

  ngOnInit() {
    this.api.getUsers()
      .subscribe(resp => {
        this.users = resp;
      });

    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        const fullNameFromToken = this.authservice.getFullNameFromToken();
        this.fullName = val || fullNameFromToken;
      });

    this.userStore.getRoleFromStore()
      .subscribe(val => {
        const roleFromToken = this.authservice.getRoleFromToken();
        this.role = val || roleFromToken;
      });

    this.items = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  logout() {
    this.authservice.SignOut();
  }
}
