import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { FrmuctComponent } from './uct/frmuct/frmuct.component';
import { AgendaComponent } from './uct/agenda/agenda.component';
//import { UctadminComponent } from './uctadmin/uctadmin.component';
import { MispendeintesComponent } from './mispendeintes/mispendeintes.component';
import { ReasigcasoComponent } from './uct/reasigcaso/reasigcaso.component';
import { ReportuctComponent } from './uct/reportuct/reportuct.component';
import { FrmmsyComponent } from './msy/frmmsy/frmmsy.component';
import { MenuComponent } from './msy/menu/menu.component';
import { HistoricoComponent } from './msy/historico/historico.component';
import { RespuestajefeComponent } from './msy/respuestajefe/respuestajefe.component'
import { RespuestaEncuestaComponent } from './msy/respuesta-encuesta/respuesta-encuesta.component'

//msy_solicitudes

const routes: Routes = [

	{ 	
        path: 'dashboard', 
		canActivate: [AuthGuard],
		component: PagesComponent,
		children: [
			{ path: '', component: DashboardComponent, data:{ titulo: 'DashBoard'} },
			{ path: 'uct_frmRegistro', component: FrmuctComponent, data:{ titulo: 'Formulario Inicial'} },
			{ path: 'account-settings', component: AccountSettingsComponent, data:{ titulo: 'Configuraciones de la cuenta'} },
			{ path: 'uct_agenda', component: AgendaComponent, data:{ titulo: 'Agenda / Bolsa de solicitudes'} },
			//{ path: 'uct_admin', component: UctadminComponent, data:{ titulo: 'Modulo Administrativo'} },
			{ path: 'misPendientes', component: MispendeintesComponent, data:{ titulo: 'Mis Pendientes'} },
			{ path: 'uct_reasigCaso', component: ReasigcasoComponent, data:{ titulo: 'Administracion 143'} },
			{ path: 'uct_reportes', component: ReportuctComponent, data:{ titulo: 'Reporte 143'} },
			{ path: 'msy_menu', component: MenuComponent, data:{ titulo: ' Mesa de ayuda'} },
			{ path: 'msy_frm', component:  FrmmsyComponent, data:{ titulo: 'Formulario Mesa de ayuda'} },
			{ path: 'msy_solicitudes', component:  HistoricoComponent, data:{ titulo: 'Registros de mesa de ayuda'} },
			{ path: 'msy_registroRespJefe', component:  RespuestajefeComponent, data:{ titulo: 'Respuesta Solicitud mesa de ayuda'} },
			{ path: 'msy_registroEncuesta', component:  RespuestaEncuestaComponent, data:{ titulo: 'Respuesta encuesta mesa de ayuda'} },
		]
	}	
]; 

@NgModule({
    imports: [ RouterModule.forChild( routes ) ],
    exports: [ RouterModule ]
})

export class PagesRoutingModule {}