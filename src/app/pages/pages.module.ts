import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

//Modulos
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { FrmuctComponent } from './uct/frmuct/frmuct.component';
import { AgendaComponent } from './uct/agenda/agenda.component';

//DATATABLE
import { BrowserModule } from "@angular/platform-browser";
import { DataTablesModule } from "angular-datatables";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//DATETIME
import { ToastrModule } from 'ngx-toastr';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule} from '@angular/material/card';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS   } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE,MAT_DATE_FORMATS } from  '@angular/material/core';
import { UctadminComponent } from './uct/uctadmin/uctadmin.component';

// calendare
import { CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MispendeintesComponent } from './mispendeintes/mispendeintes.component';
//POPOVER
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReasigcasoComponent } from './uct/reasigcaso/reasigcaso.component';
import { ReportuctComponent } from './uct/reportuct/reportuct.component';
import { FrmmsyComponent } from './msy/frmmsy/frmmsy.component';
import { MenuComponent } from './msy/menu/menu.component';
import { HistoricoComponent } from './msy/historico/historico.component';
import { RespuestajefeComponent } from './msy/respuestajefe/respuestajefe.component';
import { RespuestaEncuestaComponent } from './msy/respuesta-encuesta/respuesta-encuesta.component';
 
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    FrmuctComponent,
    AgendaComponent,
    UctadminComponent,
    MispendeintesComponent,
    ReasigcasoComponent,
    ReportuctComponent,
    FrmmsyComponent,
    MenuComponent,
    HistoricoComponent,
    RespuestajefeComponent,
    RespuestaEncuestaComponent,
  ],
  imports: [ 
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule, 
    DataTablesModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule, 
    MatNativeDateModule,
    MatCardModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
  ],
  providers:[
    {provide:MAT_DATE_LOCALE, useValue:'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [ MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],

  exports: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    AgendaComponent,
    UctadminComponent,
    MispendeintesComponent,
    ReasigcasoComponent,
    ReportuctComponent
  ],
})

export class PagesModule { 

}
