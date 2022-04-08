
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  menuItems: any[];

  constructor( private router: Router, 
    public sidebarService: SidebarService,
    private funci: FuncionarioService) { 
  }

  objeto;
  nombresUsr: string;
  apellidosUsr: string;
  imagenLs: string; 
  imagen: string; 
  imgAlterna: string;
  loadData:boolean = false;
  dependencia = Number(localStorage.getItem('idDepUsr'));
  //images_url = environment.images_url;

  ngOnInit(): void {
    this.objeto = this.funci.guardarLocalStorage();
    this.nombresUsr =this.objeto['nombresUsr'];
    this.apellidosUsr = this.objeto['apellidosUsr'];
    this.imagenLs = this.objeto['ccUsr'];
    //this.imagen =`${this.images_url}/${this.imagenLs}.png`;
    if(this.objeto['cargaData'] == true){
      this.loadData=true;
    }
    //this.menuItems = this.sidebarService.menu; 
    //this.router.navigateByUrl('/dashboard/uct_frmRegistro');  
  }

}