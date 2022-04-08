import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { breadcrumsComponent } from './breadcrums/breadcrums.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './uct/modal/modal.component';
import { ModalhistoricosolComponent } from './uct/modalhistoricosol/modalhistoricosol.component';
//DATATABEL
import { DataTablesModule } from "angular-datatables";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalCuposComponent } from './uct/modal-cupos/modal-cupos.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModalreasignarComponent } from './uct/modalreasignar/modalreasignar.component';
import { DatosSolicitudComponent } from './uct/datos-solicitud/datos-solicitud.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    LoadingComponent,
    ModalComponent,
    breadcrumsComponent,
    ModalhistoricosolComponent,
    ModalCuposComponent,
    ModalreasignarComponent,
    DatosSolicitudComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule 
    
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    LoadingComponent,
    ModalComponent,
    breadcrumsComponent,
    ModalhistoricosolComponent,
    ModalCuposComponent,
    ModalreasignarComponent,
    DatosSolicitudComponent
    
  ]
})
export class SharedModule { }
