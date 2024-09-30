import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullName = new BehaviorSubject<string>('');
  private role = new BehaviorSubject<string>('');

  userService = inject(UserService)

  loggedInUser = signal<User|undefined>(undefined)

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
