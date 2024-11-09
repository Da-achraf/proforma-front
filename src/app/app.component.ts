import { Component, inject } from '@angular/core';
import { UserService } from './services/user.service';
import { tap } from 'rxjs';
import { User } from './models/user/user.model';
import { SideNavService } from './shared/services/side-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  userService = inject(UserService)
  sideNavService = inject(SideNavService)

  constructor() {
    this.userService.getUsers().pipe(
      tap(this.sideNavService.users.set)
    ).subscribe()
  }
}
