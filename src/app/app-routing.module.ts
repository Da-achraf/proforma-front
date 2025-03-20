import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSectionComponent } from './components/admin-section/admin-section.component';
import { ConfigurationHomeComponent } from './components/configuration-home/configuration-home.component';
import { ConfigurationSectionComponent } from './components/configuration-section/configuration-section.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeliveryAddressListComponent } from './feature/delivery-address/delivery-address-list/delivery-address-list.component';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { Home1Component } from './components/home1/home1.component';
import { LoginComponent } from './components/login/login.component';
import { PlantsListComponent } from './components/plants-list/plants-list.component';
import { ShipPointsListComponent } from './components/shippoints/ship-points-list/ship-points-list.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { HistoricalDataListComponent } from './feature/historical-data/historical-data-list/historical-data-list.component';
import { ScenariosListComponent } from './feature/scenario/scenarios-list/scenarios-list.component';
import { AuthGuard } from './Guards/auth.guard';
import { NonAuthGuard } from './Guards/non-auth.guard';
import { RoleGuard } from './Guards/role.guard';
import { RoleEnum } from './core/models/user/user.model';
import { HomeRedirectResolver } from './resolvers/home-redirect.resolver';
import { RequestsTableComponent } from './shared/components/tables/req-table.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [NonAuthGuard] },
  {
    path: 'admin-section',
    component: AdminSectionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['admin'] },
  },

  {
    path: 'ConfigurationSection',
    component: ConfigurationSectionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'configurationHome',
    component: ConfigurationHomeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['admin'] },
  },

  {
    path: 'home',
    component: Home1Component,
    children: [
      {
        path: '',
        resolve: [HomeRedirectResolver],
        component: DashboardComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'requests',
        component: RequestsTableComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ALL] },
      },
      {
        path: 'usermanagement',
        component: UsersListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'plantmanagement',
        component: PlantsListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'departementmanagement',
        component: DepartmentsListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'ShipPoint',
        component: ShipPointsListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'delivery-addresses',
        component: DeliveryAddressListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'ConfigurationSection',
        component: ConfigurationHomeComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'scenarios',
        component: ScenariosListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'historical-data',
        component: HistoricalDataListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
