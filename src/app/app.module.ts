import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; // Importez HttpClientModule ici
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { NgToastModule } from 'ng-angular-popup';
import { AdminSectionComponent } from './components/admin-section/admin-section.component';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { Home1Component } from './components/home1/home1.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { UsermanagmentComponent } from './components/usermanagment/usermanagment.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListOfUsersComponent } from './components/listofusers/listofusers.component';
import { PlantmanagementComponent } from './components/plantmanagement/plantmanagement.component';
import { ListofplantsComponent } from './components/listofplants/listofplants.component';
import { DepartementmanagementComponent } from './components/departementmanagement/departementmanagement.component';
import { ListofdepartementsComponent } from './components/listofdepartements/listofdepartements.component';
import { CreatePlantComponent } from './components/create-plant/create-plant.component';
import { CreateDepartementComponent } from './components/create-departement/create-departement.component';
import { MatButtonModule } from '@angular/material/button';
import { ConfigurationSectionComponent } from './components/configuration-section/configuration-section.component';
import { ConfigurationHomeComponent } from './components/configuration-home/configuration-home.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CreateItemDialogComponent } from './components/create-item-dialog/create-item-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RequesterDashboardComponent } from './components/requester-dashboard/requester-dashboard.component';
import { ListOfRequesterComponent } from './components/list-of-requester/list-of-requester.component';
import { CreateRequestDialogComponent } from './components/create-request-dialog/create-request-dialog.component';
import { ShipPointComponent } from './components/ship-point/ship-point.component';
import { ManagementShipPointComponent } from './components/management-ship-point/management-ship-point.component';
import { DialogModule } from 'primeng/dialog';
import { FinanceDashboardComponent } from './components/finance-dashboard/finance-dashboard.component';
import { ListOfRequestFinanceComponent } from './components/list-of-request-finance/list-of-request-finance.component';
import { ModifyRequestFinanceComponent } from './components/modify-request-finance/modify-request-finance.component';
import { RejectCommentDialogComponent } from './components/reject-comment-dialog/reject-comment-dialog.component';
import { TradcomplianceDashboardComponent } from './components/tradcompliance-dashboard/tradcompliance-dashboard.component';
import { ListOfRequestTradcomplianceComponent } from './components/list-of-request-tradcompliance/list-of-request-tradcompliance.component';
import { EditRequestTradcomplianceComponent } from './components/edit-request-tradcompliance/edit-request-tradcompliance.component';
import { WarehouseDashboardComponent } from './components/warehouse-dashboard/warehouse-dashboard.component';
import { ListOfRequestWarehouseComponent } from './components/list-of-request-warehouse/list-of-request-warehouse.component';
import { EditRequestWarehouseComponent } from './components/edit-request-warehouse/edit-request-warehouse.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableModule } from 'primeng/table';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RequestsTableComponent } from './shared/components/tables/req-table.component';
import { UserRoleForDisplayPipe } from './shared/pipes/user-role-for-display.pipe';
import { RequestStatusMapper } from './shared/pipes/request-status-mapper.pipe';
import { RequestStrategyFactory } from './shared/services/requests-strategies/requests-strategies-factory';
import { LoadingDotsComponent } from './shared/components/loading-dots/loading-dots.component';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { ManagementTablesComponent } from './shared/components/management-tables/management-tables.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { IsPropertyNotEmptyPipe } from './shared/pipes/is-property-empty.pipe';
import { PlantsListComponent } from './components/plants-list/plants-list.component';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { ShipPointsListComponent } from './components/ship-points-list/ship-points-list.component';
import { DeleteConfirmationDialogComponent } from './shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    HomeComponent,
    AdminSectionComponent,
    HeaderComponent,
    SideNavComponent,
    Home1Component,
    UsermanagmentComponent,
    DashboardComponent,
    ListOfUsersComponent,
    PlantmanagementComponent,
    ListofplantsComponent,
    DepartementmanagementComponent,
    ListofdepartementsComponent,
    CreatePlantComponent,
    CreateDepartementComponent,
    ConfigurationSectionComponent,
    ConfigurationHomeComponent,
    CreateItemDialogComponent,
    RequesterDashboardComponent,
    ListOfRequesterComponent,
    CreateRequestDialogComponent,
    ShipPointComponent,
    ManagementShipPointComponent,
    FinanceDashboardComponent,
    ListOfRequestFinanceComponent,
    ModifyRequestFinanceComponent,
    RejectCommentDialogComponent,
    TradcomplianceDashboardComponent,
    ListOfRequestTradcomplianceComponent,
    EditRequestTradcomplianceComponent,
    WarehouseDashboardComponent,
    ListOfRequestWarehouseComponent,
    EditRequestWarehouseComponent,
    RequestsTableComponent,
    UserRoleForDisplayPipe,
    RequestStatusMapper,
    LoadingDotsComponent,
    SearchBarComponent,
    ManagementTablesComponent,
    UsersListComponent,
    IsPropertyNotEmptyPipe,
    PlantsListComponent,
    DepartmentsListComponent,
    ShipPointsListComponent,
    DeleteConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    ChartModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    CommonModule,
    MenubarModule,
    TooltipModule,
    OverlayPanelModule,
    MatTooltipModule,
    CarouselModule,
    CardModule,
    FlexLayoutModule,
    TableModule,
    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MultiSelectModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    PaginatorModule,
    MatChipsModule
  ],
  exports: [
    MatDialogModule
  ],
  providers: [
    AuthService,
    RequestStrategyFactory,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: tokenInterceptor,
    multi: true
    },
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    MessageService,
    DynamicDialogConfig,
    DynamicDialogRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
