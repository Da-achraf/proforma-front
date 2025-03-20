import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import { RoleEnum, User } from '../core/models/user/user.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  authService = inject(AuthService)

  private fullName = new BehaviorSubject<string>('');
  private role = new BehaviorSubject<RoleEnum | undefined>(undefined);

  readonly userRole = toSignal<RoleEnum | undefined>(this.role)

  userService = inject(UserService)

  loggedInUser = signal<User|undefined>(undefined)

  constructor() {
    const role = this.authService.getRoleFromToken()
    this.setRoleFromStore(role)
  }

  getLoggedInUser(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.loggedInUser.set(user)
      }
    })
  }

  setFullNameFromStore(fullName: string) {
    this.fullName.next(fullName);
  }

  getFullNameFromStore(): Observable<string> {
    return this.fullName.asObservable();
  }

  setRoleFromStore(role: RoleEnum) {
    this.role.next(role);
  }

  getRoleFromStore(): Observable<RoleEnum | undefined> {
    return this.role.asObservable();
  }
}
