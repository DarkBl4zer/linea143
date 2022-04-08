import { Component, OnInit  } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormariosService } from '../../../services/msy/formarios.service';
import { ListasService } from '../../../services/msy/listas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-respuestajefe',
  templateUrl: './respuestajefe.component.html',
  styles: [
  ]
})

export class RespuestajefeComponent implements OnInit {

  formaR: FormGroup;
  codigo: any;
  detalleMesaDeAyuda: any[] = [];
  loading: boolean;

  constructor(private router: Router,
    private formulario:FormariosService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private listas:ListasService
  ) { 
    this.codigo = this.router.parseUrl(this.router.url)['queryParams']['semilla'];
    this.loading=false;
    var datos = { 
      "mesaAyuda":this.codigo
    };
    this.listas.detalleSolicitud(datos)
    .subscribe( (rsp: any) => {
      console.log(rsp[0]['detalleMsy']);
      this.detalleMesaDeAyuda=rsp[0]['detalleMsy'];
      console.log(this.detalleMesaDeAyuda);
      this.loading = true;
    });
    this.crearFormulario();
  }

  ngOnInit(): void {}
  //Validar los campos obligatorios
  nombreInvalido(campo){
    return this.formaR.get(campo).invalid && this.formaR.get(campo).touched;
  }
  //Registro formulario
  guardar(){
    
    //verificar si todos los campos se diligenciaron 
    if(!this.formaR.valid) {
      this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.formaR.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }
    //VERIFICAR TIPO TELEFONO CELULAR
  

 
    //cargar vista de loading
    this.loading = true;

    //REgistrar informacion
    this.formulario.regitroAprobacion(this.formaR.value)
    .subscribe( e => { 
      console.log(e[0]['codigo']);
      if(e[0]['codigo'] === '0'){
        const mm = this.toastr.success(e[0]['msg'], 'Proceso Exitoso ', { 
            enableHtml: true,
            progressBar:true,
            disableTimeOut:true,
            tapToDismiss:true,
            closeButton:true
          },
        );
        mm.onAction.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.formaR.reset();
        });
        mm.onHidden.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.formaR.reset();
        });
        mm.onTap.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.formaR.reset();
        });


      }else{
        this.toastr.error(e[0]['msg'], 'Atención ', {
          timeOut: 5000,
        });
        this.loading = false;
      }
    });
  }


  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    this.formaR=this.fb.group({
      DetalleRepuesta: ['',Validators.required],
      aprobacion: ['',Validators.required],
      mesaDeAyuda: [this.codigo],
    });
  }


 


}
