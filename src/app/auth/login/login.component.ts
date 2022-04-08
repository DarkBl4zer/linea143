import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    usuario: ['',[Validators.required, Validators.minLength(4),Validators.maxLength(10)]],
    clave: ['',Validators.required],
    terminos:[false, Validators.required],
  });

  constructor( 
    private router: Router,
    private fb: FormBuilder,
    private funcService: FuncionarioService,
    private http: HttpClient, 
  ) { }

  loading: boolean;
  estError: boolean;

  

  validarUsuario(){

    this.loading = true;
    this.formSubmitted = true;
 
    if(this.registerForm.invalid){
      this.loading = false;
      return;
    }
/*
    (this.funcService.verificarLogin(this.registerForm.value))
    .subscribe(rsp =>{
      if(rsp === false) { this.loading = false;}
    });
*/
  }

  campoNoValido( campo:string): boolean{
    if( this.registerForm.get(campo).invalid && this.formSubmitted ){
      return true;
    }else{ 
      return false;
    }
  }
  
  validarClave( usuario:string, clave:string): boolean{
    if(this.registerForm.get(usuario).value !== this.registerForm.get(clave).value ){
      return false;
    }else{
      return true;
    }
  }

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

  ngOnInit(): void {
  }


}
