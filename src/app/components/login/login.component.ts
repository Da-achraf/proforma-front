import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Import MessageService
import { RoleEnum } from '../../models/user/user.model';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  passwordFieldType: string = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService,
    private messageService: MessageService // Inject MessageService
  ) {
    this.LoginForm = new FormGroup({
      identifier: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {}

  loginSubmitted() {
    if (this.LoginForm.valid) {
      const { identifier, password } = this.LoginForm.value;
      this.authService.LoginUser(identifier, password).subscribe({
        next: (res: string) => {
          if (res === 'Failure') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login unsuccessful' });
          } else {
            localStorage.clear(); // Clear localStorage to ensure no old data remains
            this.LoginForm.reset();
            this.authService.StoreToken(res);
            let tokenPayload = this.authService.decodedToken();
            this.userStore.setFullNameFromStore(tokenPayload.unique_name);
            this.userStore.setRoleFromStore(tokenPayload.role);

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful' });
            this.redirectToDashboard(tokenPayload.role as RoleEnum);
          }
        },
        error: (err) => {
          console.error('Error during login', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Form is invalid' });
    }
  }

  redirectToDashboard(role: RoleEnum) {
    if (role == RoleEnum.ADMIN)
      this.router.navigate(['/home']);
    else
      this.router.navigate(['/home/requests']);

    // switch (role) {
    //   case RoleEnum.ADMIN:
    //     this.router.navigate(['/home']);
    //     break;
    //   case RoleEnum.REQUESTER:
    //     this.router.navigate(['/requesterdashboard']);
    //     break;
    //   case RoleEnum.FINANCE_APPROVER:
    //     this.router.navigate(['/financedashboard']);
    //     break;
    //   case RoleEnum.TRADECOMPLIANCE_APPROVER:
    //     this.router.navigate(['/tradcompliancedashboard']);
    //     break;
    //   case RoleEnum.WAREHOUSE_APPROVER:
    //     this.router.navigate(['/warehousedashboard']);
    //     break;
    //   default:
    //     this.router.navigate(['/login']);
    //     break;
    // }
  }

  get identifier(): FormControl {
    return this.LoginForm.get('identifier') as FormControl;
  }

  get password(): FormControl {
    return this.LoginForm.get('password') as FormControl;
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
