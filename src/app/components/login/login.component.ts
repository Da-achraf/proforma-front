import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { RoleEnum } from '../../models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { ToasterService } from '../../shared/services/toaster.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, NgClass, RouterLink]
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  passwordFieldType: string = 'password';

  private readonly returnUrl: Signal<string> = toSignal(
    inject(ActivatedRoute).queryParams.pipe(
      map((data) => data['returnUrl'] ?? '/home')
    )
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService,
    private toastr: ToasterService
  ) {
    this.LoginForm = new FormGroup({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {
  }

  loginSubmitted() {
    if (this.LoginForm.valid) {
      const { identifier, password } = this.LoginForm.value;
      this.authService.LoginUser(identifier, password).subscribe({
        next: (res: string) => {
          if (res === 'Failure') {
            this.toastr.showError('Login failed');
          } else {
            localStorage.clear(); // Clear localStorage to ensure no old data remains
            this.LoginForm.reset();
            this.authService.StoreToken(res);
            let tokenPayload = this.authService.decodedToken();
            this.userStore.setFullNameFromStore(tokenPayload.unique_name);
            this.userStore.setRoleFromStore(tokenPayload.role as RoleEnum);

            this.toastr.showSuccess('Logged in successfully');
            this.router.navigateByUrl(this.returnUrl());
          }
        },
        error: (err) => {
          this.toastr.showError('Login failed');
        },
      });
    } else {
      this.toastr.showWarning('Form is invalid');
    }
  }

  get identifier(): FormControl {
    return this.LoginForm.get('identifier') as FormControl;
  }

  get password(): FormControl {
    return this.LoginForm.get('password') as FormControl;
  }
  
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
