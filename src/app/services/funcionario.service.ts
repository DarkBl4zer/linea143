import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
//import { Router } from '@angular/router';
//import Swal from 'sweetalert2';
//import { map } from "rxjs/operators";



const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor(
    private http: HttpClient
  ) { }

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  confirmarDatosSession(){  
    
    if(this.getCookie("ccUser")){
      var data = {
        cedula: this.getCookie("ccUser")
      };
      this.http.post(`${base_url}/login`,data)
      .subscribe( rsp =>{
        if(rsp['status'] !== 200){
          localStorage.setItem('consecUsr','undefined');
          localStorage.setItem('nombresUsr','undefined');
          localStorage.setItem('apellidosUsr','undefined');
          localStorage.setItem('ccUsr','undefined');
          localStorage.setItem('emailUsr','undefined');
          localStorage.setItem('idDepUsr','undefined');
          localStorage.setItem('rolUsr','undefined');
          localStorage.setItem('imgUsr','undefined');
          localStorage.setItem('nomDep','undefined');
          localStorage.setItem('token','Token is Expired');
        }else if(rsp['status'] === 200){
          localStorage.setItem('consecUsr',rsp['user']['consec']);
          localStorage.setItem('nombresUsr',rsp['user']['nombre']);
          localStorage.setItem('apellidosUsr',rsp['user']['apellido']);
          localStorage.setItem('ccUsr',rsp['user']['cedula']);
          localStorage.setItem('emailUsr',rsp['user']['email']);
          localStorage.setItem('idDepUsr',rsp['user']['depend_codigo']);
          //localStorage.setItem('rolUsr',rsp['user']['rol']);
          //localStorage.setItem('imgUsr',rsp['user']['objeto_social']);
          //localStorage.setItem('nomDep',rsp['user']['nomdep']);
          localStorage.setItem('token',rsp['token']);
          //Swal.fire('Ingreso exitoso',rsp['mensaje'], 'success');
        }
      })
    }

    if( localStorage.getItem('consecUsr') !== 'undefined' &&
      localStorage.getItem('ccUsr') !== 'undefined' &&
      localStorage.getItem('token') !== 'undefined' &&
      localStorage.getItem('token') !== 'Token is Expired' &&
      localStorage.getItem('idDepUsr') !== 'undefined' &&
      localStorage.getItem('emailUsr') !== 'undefined' ){
      return true;
    }else{
      return false;
    }
  }

  guardarLocalStorage(){
    let nombresUsr:string= '';
    let apellidosUsr:string= '';
    let email:string= '';
    let nomDep:string= '';
    let idDepUsr:string= '';
    let imgUsr:string= '';
    let ccUsr:string='';
    let cargaData:boolean=false;

    nombresUsr = localStorage.getItem('nombresUsr');
    apellidosUsr = localStorage.getItem('apellidosUsr');
    //email =  localStorage.getItem('emailUsr'); 
    email =  localStorage.getItem('emailUsr').split('@')[0]; 
    nomDep = localStorage.getItem('nomDep');
    idDepUsr = localStorage.getItem('idDepUsr');
    imgUsr= localStorage.getItem('imgUsr');
    ccUsr=localStorage.getItem('ccUsr');
    cargaData=true;

    var valores = 
    {
        "nombresUsr": nombresUsr,
        "idapellidosUsr": apellidosUsr,
        "email":email,
        "nomDep":nomDep,
        "idDepUsr":idDepUsr,
        "imgUsr":imgUsr,
        "ccUsr":ccUsr,
        "cargaData":cargaData
    };
    return valores;
  }
  
}
