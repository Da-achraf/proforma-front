import { Component, inject } from '@angular/core';
import { tap } from 'rxjs';
import { UserService } from './services/user.service';
import { SideNavService } from './shared/services/side-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  userService = inject(UserService);
  sideNavService = inject(SideNavService);

  constructor() {
    this.userService
      .getUsers()
      .pipe(tap(this.sideNavService.users.set))
      .subscribe();
  }
}
