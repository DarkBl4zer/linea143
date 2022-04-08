import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormariosService } from '../../../services/msy/formarios.service';
import { ListasService } from '../../../services/msy/listas.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-respuesta-encuesta',
  templateUrl: './respuesta-encuesta.component.html',
  styles: [
  ]
})
export class RespuestaEncuestaComponent implements OnInit {

  formaEn: FormGroup;
  codigo: any;
  detalleMesaDeAyuda: any[] = [];
  historicoMesaDeAyuda: any[] = [];
  loading: boolean;
  idDepMsy: any;
  asistencia: any;
  servicio: any;

  constructor(private router: Router,
    private formulario:FormariosService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private listas:ListasService) { 
      this.codigo = this.router.parseUrl(this.router.url)['queryParams']['semilla'];
      this.loading=false;
      var datos = { 
        "mesaAyuda":this.codigo
      };
      this.listas.detalleSolicitud(datos)
      .subscribe( (rsp: any) => {
        console.log(rsp[0]['detalleMsy']);
        this.historicoMesaDeAyuda=rsp[0]['historial'];
        this.detalleMesaDeAyuda=rsp[0]['detalleMsy'];
        this.idDepMsy=rsp[0]['detalleMsy']['idDepMsy'];
        this.asistencia=rsp[0]['detalleMsy']['asistencia'];
        this.servicio=rsp[0]['detalleMsy']['servicio'];
        console.log(this.detalleMesaDeAyuda);
        this.loading = true;
      });
      this.crearFormulario();
      console.log(this.codigo);
    }

  ngOnInit(): void {
  }
  
  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    this.formaEn=this.fb.group({
      pU: ['',Validators.required],
      pD: ['',Validators.required],
      pT: ['',Validators.required],
      pC: [''],
      pCi: [''],
      pS: [''],
      pSi: [''],
      observacion: ['',Validators.required],
      mesaDeAyuda: [this.codigo],
      idDepMsy: [this.idDepMsy],
      asistencia: [this.asistencia],
      servicio: [this.servicio],
    });
  }

    //Validar los campos obligatorios
    nombreInvalido(campo){
      return this.formaEn.get(campo).invalid && this.formaEn.get(campo).touched;
    }
    //Registro formulario
    guardar(){
      //verificar si todos los campos se diligenciaron 
      if(!this.formaEn.valid) {
        this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaEn.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }
      //cargar vista de loading
      this.loading = true;
       //REgistrar informacion
    this.formulario.regitroEncuentaUsr(this.formaEn.value)
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
          window.close();
        });
        mm.onHidden.subscribe((close) => {
          this.loading = false;
          window.close();
        });
        mm.onTap.subscribe((close) => {
          this.loading = false;
          window.close();
        });


      }else{
        this.toastr.error(e[0]['msg'], 'Atención ', {
          timeOut: 5000,
        });
        this.loading = false;
      }
    });
    }  

}
