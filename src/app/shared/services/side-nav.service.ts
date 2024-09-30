import { Injectable } from '@angular/core';
import { RoleEnum } from '../../models/user/user.model';

export type Menu = {
  label: string
  icon: string
  routerLink: string
  roles?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  private menuItems: Menu[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-chart-bar',
      routerLink: '/home/dashboard',
      roles: [RoleEnum.ADMIN]
    },
    {
      label: 'Requests',
      icon: 'pi pi-copy',
      routerLink: '/home/requests',
      roles: [RoleEnum.ALL]
    },
    {
      label: 'User Management',
      icon: 'pi pi-fw pi-user',
      routerLink: '/home/usermanagement',
      roles: [RoleEnum.ADMIN]
    },
    {
      label: 'Plant Management',
      icon: 'pi pi-fw pi-building',
      routerLink: '/home/plantmanagement',
      roles: [RoleEnum.ADMIN]
    },
    {
      label: 'Department Management',
      icon: 'pi pi-fw pi-sitemap',
      routerLink: '/home/departementmanagement',
      roles: [RoleEnum.ADMIN]
    },
    {
      label: 'Configuration Section',
      icon: 'pi pi-fw pi-cog',
      routerLink: '/home/ConfigurationSection',
      roles: [RoleEnum.ADMIN]
    },
    {
      label: 'Shipping Point',
      icon: 'pi pi-fw pi-truck',
      routerLink: '/home/ShipPoint',
      roles: [RoleEnum.ADMIN]
    }
  ];

  getMenuItemsBaseOnRole(role: RoleEnum): Menu[] {
    return this.menuItems.filter((item: Menu) => {
      return item.roles?.includes(role) || item.roles?.includes(RoleEnum.ALL)
    })
  }

}
