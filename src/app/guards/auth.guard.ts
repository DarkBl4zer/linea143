import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuncionarioService } from '../services/funcionario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  nombresUsr:string= '';
  apellidosUsr:string= '';
  email:string= '';
  nomDep:string= '';
  idDepUsr:string= '';
  constructor( 
    private funcService: FuncionarioService,
    private router: Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if(this.funcService.confirmarDatosSession() !== true){
      window.location.href = "https://apps.personeriabogota.gov.co";
    //this.router.navigateByUrl('/login');
    }
    return this.funcService.confirmarDatosSession();
  }
  
}
