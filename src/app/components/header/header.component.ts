import { TitleCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { Toolbar } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';
import { UserRoleForDisplayPipe } from '../../shared/pipes/user-role-for-display.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [Toolbar, TitleCasePipe, OverlayPanelModule, UserRoleForDisplayPipe],
})
export class HeaderComponent implements OnInit {
  protected readonly userStore = inject(UserStoreService);
  protected readonly router = inject(Router);
  protected readonly api = inject(UserService);
  protected readonly authservice = inject(AuthService);

  private readonly trigger = viewChild('overlayPanelTrigger', {
    read: ElementRef,
  });
  private readonly overlayPanel = viewChild(OverlayPanel);

  toggleSidebarForMe = output();

  protected triggerWidth!: number;
  protected fullName: string = ' ';
  protected users: any = [];
  protected role!: string;

  ngOnInit() {
    this.api.getUsers().subscribe((resp) => {
      this.users = resp;
    });

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.authservice.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.authservice.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  // Update width before showing panel
  toggleOverlay(event: Event) {
    this.triggerWidth = this.trigger()?.nativeElement.offsetWidth;
    this.overlayPanel()?.toggle(event);
  }

  logout() {
    this.authservice.SignOut();
  }
}
