import { RoleEnum } from "./user/user.model";



export type SidenavItem = {
    label: string
    icon: string
    routerLink: string
    roles?: string[]
}

export const allMenuItems: SidenavItem[] = [
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
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        routerLink: '/home/usermanagement',
        roles: [RoleEnum.ADMIN]
    },
    {
        label: 'Plants',
        icon: 'pi pi-fw pi-building',
        routerLink: '/home/plantmanagement',
        roles: [RoleEnum.ADMIN]
    },
    {
        label: 'Departments',
        icon: 'pi pi-fw pi-sitemap',
        routerLink: '/home/departementmanagement',
        roles: [RoleEnum.ADMIN]
    },
    {
        label: 'Shipping Points',
        icon: 'pi pi-fw pi-truck',
        routerLink: '/home/ShipPoint',
        roles: [RoleEnum.ADMIN]
    },
    {
        label: 'Configuration',
        icon: 'pi pi-fw pi-cog',
        routerLink: '/home/ConfigurationSection',
        roles: [RoleEnum.ADMIN]
    }
];
