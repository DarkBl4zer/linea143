import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../services/sidebar.service';
import { FuncionarioService } from '../services/funcionario.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(
    private funci: FuncionarioService
  ) { }
  objeto;
  nombresUsr: string;
  email: string;
  apellidosUsr:string;
  

  ngOnInit(): void {
    
    //this.sidebarService.menuG; 
    
    this.objeto = this.funci.guardarLocalStorage();
    this.nombresUsr =this.objeto['nombresUsr'];
    this.email = this.objeto['email'];
    this.apellidosUsr = this.objeto['apellidosUsr'];
    
  }
}