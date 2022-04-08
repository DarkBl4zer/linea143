import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
   
  menuMsy: any[] = [
    {
      titulo: 'Mesa_de_Ayuda',
      icon: 'mdi mdi-desktop-mac',
      submenu: [
        {titulo: '° Menu mesa de ayuda',url: '/dashboard/msy_menu' },
      ]
    },
  ];

  menuUct: any[] = [
    {
      titulo: 'Linea_143',
      icon: 'mdi mdi-file',
      submenu: [
        {titulo: '° Formulario Inicial',url: '/dashboard/uct_frmRegistro' },
        {titulo: '° Bolsa de solicitudes',url: '/dashboard/uct_agenda' },
        {titulo: '° Reporte Express',url: '/dashboard/uct_reportes' },
      ]
    },
  ];

  menuSistema: any[] = [
    {
      titulo: 'Sistema',
      icon: 'mdi mdi-bullseye',
      submenu: [
        {titulo: '° Administrar sistema',url: '/dashboard/account-settings' },
      ]
    },
  ];

  menuG: any[] = [
    {
      titulo: 'General',
      submenu: [
        {titulo: '° Mis pendientes',url: '/dashboard/misPendientes' },
      ]
    },
  ];
  
  constructor() {}

 
}
