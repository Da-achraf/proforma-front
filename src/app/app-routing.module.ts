import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSectionComponent } from './components/admin-section/admin-section.component';
import { ConfigurationHomeComponent } from './components/configuration-home/configuration-home.component';
import { ConfigurationSectionComponent } from './components/configuration-section/configuration-section.component';
import { CreateDepartementComponent } from './components/create-departement/create-departement.component';
import { CreatePlantComponent } from './components/create-plant/create-plant.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeliveryAddressListComponent } from './components/delivery-address/delivery-address-list/delivery-address-list.component';
import { DepartementmanagementComponent } from './components/departementmanagement/departementmanagement.component';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { FinanceDashboardComponent } from './components/finance-dashboard/finance-dashboard.component';
import { Home1Component } from './components/home1/home1.component';
import { ListOfRequestFinanceComponent } from './components/list-of-request-finance/list-of-request-finance.component';
import { ListOfRequestTradcomplianceComponent } from './components/list-of-request-tradcompliance/list-of-request-tradcompliance.component';
import { ListOfRequestWarehouseComponent } from './components/list-of-request-warehouse/list-of-request-warehouse.component';
import { ListOfRequesterComponent } from './components/list-of-requester/list-of-requester.component';
import { LoginComponent } from './components/login/login.component';
import { PlantmanagementComponent } from './components/plantmanagement/plantmanagement.component';
import { PlantsListComponent } from './components/plants-list/plants-list.component';
import { RequesterDashboardComponent } from './components/requester-dashboard/requester-dashboard.component';
import { ShipPointsListComponent } from './components/shippoints/ship-points-list/ship-points-list.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TradcomplianceDashboardComponent } from './components/tradcompliance-dashboard/tradcompliance-dashboard.component';
import { UsermanagmentComponent } from './components/usermanagment/usermanagment.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { WarehouseDashboardComponent } from './components/warehouse-dashboard/warehouse-dashboard.component';
import { authGuardGuard } from './Guards/auth-guard.guard';
import { LoginGuard } from './Guards/login.guard';
import { RoleEnum } from './models/user/user.model';
import { InvoiceComponent } from './shared/components/invoice/invoice.component';
import { RequestsTableComponent } from './shared/components/tables/req-table.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'admin-section',
    component: AdminSectionComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'usermanagement',
    component: UsermanagmentComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },

  {
    path: 'plantmanagement',
    component: PlantmanagementComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },

  {
    path: 'departementmanagement',
    component: DepartementmanagementComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'CreatePlant',
    component: CreatePlantComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'CreateDepartement',
    component: CreateDepartementComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'ConfigurationSection',
    component: ConfigurationSectionComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'configurationHome',
    component: ConfigurationHomeComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['admin'] },
  },
  {
    path: 'requesterdashboard',
    component: RequesterDashboardComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['requester'] },
  },
  {
    path: 'listofrequester',
    component: ListOfRequesterComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['requester'] },
  },
  {
    path: 'financedashboard',
    component: FinanceDashboardComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['finance'] },
  },
  {
    path: 'listofrequestfinance',
    component: ListOfRequestFinanceComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['finance'] },
  },
  {
    path: 'tradcompliancedashboard',
    component: TradcomplianceDashboardComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['tradecompliance'] },
  },
  {
    path: 'listofrequesttradcompliance',
    component: ListOfRequestTradcomplianceComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['tradecompliance'] },
  },
  {
    path: 'warehousedashboard',
    component: WarehouseDashboardComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['warehouse'] },
  },
  {
    path: 'listofrequestwarehouse',
    component: ListOfRequestWarehouseComponent,
    canActivate: [LoginGuard, authGuardGuard],
    data: { expectedRoles: ['warehouse'] },
  },

  {
    path: 'home',
    component: Home1Component,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'requests',
        component: RequestsTableComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ALL] },
      },
      {
        path: 'usermanagement',
        component: UsersListComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'plantmanagement',
        component: PlantsListComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'departementmanagement',
        component: DepartmentsListComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'ShipPoint',
        component: ShipPointsListComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'delivery-addresses',
        component: DeliveryAddressListComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
      {
        path: 'ConfigurationSection',
        component: ConfigurationHomeComponent,
        canActivate: [LoginGuard, authGuardGuard],
        data: { expectedRoles: [RoleEnum.ADMIN] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
