import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from '../../services/funcionario.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit  {

  


  constructor( private funci: FuncionarioService) { }

  objeto;
  nombresUsr: string;
  email: string; 
  imagenLs: string; 
  imagen: string; 
  images_url = environment.images_url;

  ngOnInit(): void {
    //this.funci.guardarLocalStorage();
    this.objeto = this.funci.guardarLocalStorage();
    this.nombresUsr =this.objeto['nombresUsr'];
    this.email = this.objeto['email'];
    this.imagenLs = this.objeto['ccUsr'];
    this.imagen =`${this.images_url}/${this.imagenLs}.png`;
  }

}
