import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})  
 
export class SidebarComponent implements OnInit { 

  menuUct: any[];
  menuMsy: any[];
  menuSistema: any[];
  menuG: any[];
  

  constructor( 
    public sidebarService: SidebarService,
    private funci: FuncionarioService
  ) { 
    this.menuUct = sidebarService.menuUct; 
    this.menuMsy = sidebarService.menuMsy;
    this.menuSistema = sidebarService.menuSistema; 
    this.menuG = sidebarService.menuG; 
    
  }

  objeto;
  nombresUsr: string;
  apellidosUsr: string;
  imagenLs: string; 
  imagen: string; 
  imgAlterna: string;
  loadData:boolean = false;
  images_url = environment.images_url;
  dependencia = Number(localStorage.getItem('idDepUsr'));

  ngOnInit(): void {
    this.objeto = this.funci.guardarLocalStorage();
    this.nombresUsr =this.objeto['nombresUsr'];
    this.apellidosUsr = this.objeto['apellidosUsr'];
    this.imagenLs = this.objeto['ccUsr'];
    this.imagen =`${this.images_url}/${this.imagenLs}.png`;
    if(this.objeto['cargaData'] == true){
      this.loadData=true;
    }


    var cedulas = ["1010213817", "52975827", "52.710.835","1052358057", "93152103", "51732791","1018457964","1014179264"];
    var ccUsr=localStorage.getItem('ccUsr');
    if(cedulas.indexOf(ccUsr) !== -1){
      this.menuUct[0]['submenu'].push({
        titulo: '° Administracion 143', 
        url: '/dashboard/uct_reasigCaso'
      });
    }

  }
}
