import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user/user.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  authService = inject(AuthService)

  private fullName = new BehaviorSubject<string>('');
  private role = new BehaviorSubject<string>('');

  public userRole = toSignal(this.role)

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

  setRoleFromStore(role: string) {
    this.role.next(role);
  }

  getRoleFromStore(): Observable<string> {
    return this.role.asObservable();
  }
}
