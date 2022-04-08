import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ListasService } from '../../../services/msy/listas.service';
import { FormariosService } from '../../../services/msy/formarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-frmmsy',
  templateUrl: './frmmsy.component.html',
})
export class FrmmsyComponent implements OnInit {

  
  formaE: FormGroup;
  mesasAyuda: any[] = [];
  listaTipoSolicitud: any[] = [];
  listaTipoAsistencia: any[] = [];
  listaTipoServicios: any[] = [];
  listaElementos:any[] = [];
  loading: boolean;
  loadingTipoSol: boolean;
  loadingTipoAsistencia: boolean;
  loadingTipoServ: boolean;
  loadingElementos: boolean;
  //
  tiempoServicio='';
  detalleServicio='';
  aprobacionServicio='';
  formatoServicio='';
  msyRecursosFisicos: boolean = true;
  elementoDescCan: string;
  elementoDesc: string;

  msyG:any;
  solicitudG:any;
  asistenciaG:any;
  servicioG:any;

  constructor(
    private fb: FormBuilder,
    private listas: ListasService,
    private toastr: ToastrService,
    private frmService: FormariosService
  ) {
    this.listasFrm();
   }

  ngOnInit(): void {
    this.loading = true;
  }
  //Listas necesaria apra el formulario
  listasFrm(){
    this.crearFormulario();
    //tipo mesa de ayuda
    this.listas.getMesaAyuda()
    .subscribe( (rsp:any) => {
      this.mesasAyuda = rsp;
      this.loading = false;
    });

  }

  cambioMesaAyuda(dato){
    //Activar load de tipo solicitud 
    this.loadingTipoSol=true;
    //Llamar api para tiposolicitud
    this.listas.getTipoSolicitud(dato)
    .subscribe( (rsp:any) => {
      this.listaTipoSolicitud = rsp;
      this.loadingTipoSol=false;
    });
    //Limpiar campos
    this.formaE.get('tipoSolicitud').reset();
    this.formaE.get('tipoAsistencia').reset();
    this.formaE.get('tipoServicio').reset();
    this.msyRecursosFisicos=true;
    
  }

  cambioTipoSolicitud(){
 
    var datos = {
      "idMsy":this.formaE.get('mesaDeAyuda').value,
      "idTipoSol":this.formaE.get('tipoSolicitud').value,
    };
    //Activar load de tipo solicitud 
    this.loadingTipoAsistencia=true;
    //Llamar api para tiposolicitud
    this.listas.getAsistencia(datos)
    .subscribe( (rsp:any) => {
      this.listaTipoAsistencia = rsp;
      this.loadingTipoAsistencia=false;
    });   
    //Limpiar campos
    this.formaE.get('tipoAsistencia').reset();
    this.formaE.get('tipoServicio').reset();
  }

  cambioTipoAsistencia(){
    var datos = {
      "idMsy":this.formaE.get('mesaDeAyuda').value,
      "idAsistencia":this.formaE.get('tipoAsistencia').value,
    };
    //Activar load de tipo solicitud 
    this.loadingTipoServ=true;
    //Llamar api para tiposolicitud
    this.listas.getServicio(datos)
    .subscribe( (rsp:any) => {
      this.listaTipoServicios = rsp;
      this.loadingTipoServ= false;
    }); 
    //Limpiar campos
    this.formaE.get('tipoServicio').reset();
  }

  cambioTipoServicio(){
    var datos = {
      "idMsy": this.formaE.get('mesaDeAyuda').value,
      "idAsistencia": this.formaE.get('tipoAsistencia').value,
      "idServicio": this.formaE.get('tipoServicio').value,
    };
    this.loadingElementos=true;
    //Llamar api para tiposolicitud
    this.listas.getDetalleServicio(datos)
    .subscribe( (rsp:any) => {

      if(rsp == null){
        this.toastr.error('El servicio selecionado cuenta con fallas de registro. Por favor informe a tics', 'Atención ', {
          timeOut: 5000,
        });
      }

      this.formatoServicio = rsp[0]['formato'];
      this.tiempoServicio = rsp[0]['dias_necesario'] == null ? 'La solicitud no posee un rango específico de dias' : rsp[0]['dias_necesario'];
      this.aprobacionServicio = rsp[0]['aprobacion'] == 0 ? 'La solicitud requiere ser aprobada por el coordinador' : 'La solicitud no requiere ser aprobada';
      this.formaE.get('detalleSol').setValue(rsp[0]['detalleServicio']);
      this.formaE.get('aprobacion').setValue(rsp[0]['aprobacion']);

      let msy = this.formaE.get('mesaDeAyuda').value;
      let solicitud = this.formaE.get('tipoSolicitud').value;
      let asistencia = this.formaE.get('tipoAsistencia').value; 
      let servicio = this.formaE.get('tipoServicio').value;
      this.msyG = this.formaE.get('mesaDeAyuda').value;
      this.solicitudG = this.formaE.get('tipoSolicitud').value;
      this.asistenciaG = this.formaE.get('tipoAsistencia').value; 
      this.servicioG = this.formaE.get('tipoServicio').value;

      if(msy==331 && asistencia==5 && servicio==5){
        this.listas.getElementos()
        .subscribe( (rsp:any) => {
          this.listaElementos = rsp; 
          this.msyRecursosFisicos=false
          this.loadingElementos=false;
        });
      }else{
         this.msyRecursosFisicos=true;
         this.loadingElementos=false;
      } 
      //
    }); 
  }
  adicionarElemnto(){
    let elemento = this.formaE.get('elementoDesc').value;
    let cantidad = this.formaE.get('elementoDescCan').value;
    let articulo = elemento+" "+cantidad
    let detalle = this.formaE.get('detalleSol').value + "\n"+articulo ;
    this.formaE.get('detalleSol').setValue(detalle);
  }

  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    this.formaE =this.fb.group({
      mesaDeAyuda: ['',Validators.required],
      tipoSolicitud: ['',Validators.required],
      tipoAsistencia: ['',Validators.required],
      tipoServicio:['', Validators.required],
      numCel:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      exten:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      detalleSol:['', Validators.required],
      elementoDescCan:[''],
      elementoDesc:[''],
      Fichier1:null,
      aprobacion:[''],
      fecha:[''],
      horaSalida:[''],
      horaRegreso:[''],
      operarivoNoc:[''],
      detalleUsr:[''],
      consecFunc:[localStorage.getItem('consecUsr')],
      ccFunc:[localStorage.getItem('ccUsr')],
      idDep:[localStorage.getItem('idDepUsr')],
      //consecFunc:[52421730],
      //ccFunc:[1010213817],
      //idDep:[2],
    });
  }

  onFileChangeArc(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formaE.get('Fichier1').setValue({
          name: file.name,
          type: file.type,
          size: file.size,
          value: (<string>reader.result).split(',')[1]
        })
      };
    }
  }

  //Validar los campos obligatorios
  nombreInvalido(campo){
    return this.formaE.get(campo).invalid && this.formaE.get(campo).touched;
  }

  guardar(){

    
    //verificar si todos los campos se diligenciaron 
    if(!this.formaE.valid) {
      this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.formaE.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }
    //VERIFICAR TIPO TELEFONO CELULAR
    var telU = this.formaE.get('numCel').value;
    if( parseInt(telU.length)  ===  10){
    }else{
      this.toastr.error('verifique la cantidad de caracteres en el telefono celular. solo son permitidos 10 caracteres', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.formaE.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }
    //Validadres para vehiculo
    var msy = this.formaE.get('mesaDeAyuda').value;
    var asistencia = this.formaE.get('tipoAsistencia').value;
    var servicio = this.formaE.get('tipoServicio').value;

    if(msy==331 && asistencia==9 && servicio==9){
      //VERIFICAR TIPO Extencion
      var horaSal = this.formaE.get('horaSalida').value;
      if( parseInt(horaSal.length)  !==  5){
        this.toastr.error('verifique la cantidad de caracteres en la hora de salida, recuerde que el formato es HH:MM', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaE.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }
      var horaReg = this.formaE.get('horaRegreso').value;
      if( parseInt(horaReg.length)  !==  5){
        this.toastr.error('verifique la cantidad de caracteres en la hora de regreso, recuerde que el formato es HH:MM', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaE.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }

      let fecha = this.formaE.get('fecha').value;
      let horaSalida = this.formaE.get('horaSalida').value;
      let horaRegreso = this.formaE.get('horaRegreso').value;
      let detalleSol = this.formaE.get('detalleSol').value;
      let detalleUsr = this.formaE.get('detalleUsr').value;
      let detalle= detalleSol+"<br>Fecha del servicio: "+fecha+"<br> Hora inicio:"+horaSalida+"<br>Hora inicio: "+horaRegreso+"<br> Teléfonos de contacto: "+detalleUsr;
      this.formaE.get('detalleSol').setValue(detalle);   

    }

    if(msy==331 && asistencia==3 && servicio==3){
      //VERIFICAR TIPO Extencion
      var horaSal = this.formaE.get('horaSalida').value;
      if( parseInt(horaSal.length)  !==  5){
        this.toastr.error('verifique la cantidad de caracteres en la hora de salida, recuerde que el formato es HH:MM', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaE.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }
      var horaReg = this.formaE.get('horaRegreso').value;
      if( parseInt(horaReg.length)  !==  5){
        this.toastr.error('verifique la cantidad de caracteres en la hora de regreso, recuerde que el formato es HH:MM', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaE.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }

      let fecha = this.formaE.get('fecha').value;
      let horaSalida = this.formaE.get('horaSalida').value;
      let horaRegreso = this.formaE.get('horaRegreso').value;
      let detalleSol = this.formaE.get('detalleSol').value;
      let detalle= detalleSol+"<br> Facha de la visita: "+fecha+"<br> Hora salida:"+horaSalida+"<br>Hora salida: "+horaRegreso;
      this.formaE.get('detalleSol').setValue(detalle);

    }
    
    if(msy==331 && asistencia==2 && servicio==2){

      //VERIFICAR TIPO Extencion
      var horaSal = this.formaE.get('horaSalida').value;
      if( parseInt(horaSal.length)  !==  5){
        this.toastr.error('verifique la cantidad de caracteres en la hora de salida, recuerde que el formato es HH:MM', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaE.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }
      var horaReg = this.formaE.get('horaRegreso').value;
      if( parseInt(horaReg.length)  !==  5){
        this.toastr.error('verifique la cantidad de caracteres en la hora de regreso, recuerde que el formato es HH:MM', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaE.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }
      let fecha = this.formaE.get('fecha').value;
      let horaSalida = this.formaE.get('horaSalida').value;
      let horaRegreso = this.formaE.get('horaRegreso').value;
      let operarivoNoc = this.formaE.get('operarivoNoc').value;
      let detalleUsr = this.formaE.get('detalleUsr').value;
      let detalleSol = this.formaE.get('detalleSol').value;
      let detalle= detalleSol+"<br> Fecha del servicio: "+fecha+"<br> Hora salida:"+horaSalida+"<br>Hora regreso: "+horaRegreso+"<br>Usuarios: "+detalleUsr+"<br>Operacion nocturna?: "+operarivoNoc;
      this.formaE.get('detalleSol').setValue(detalle);
    }

    //VERIFICAR TIPO Extencion
    var telU = this.formaE.get('exten').value;
    if( parseInt(telU.length)  ===  4){
    }else{
      this.toastr.error('verifique la cantidad de caracteres en el numero de extencion. solo son permitidos 4 caracteres', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.formaE.controls).forEach( control =>{
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
    this.frmService.registrarFormulario(this.formaE.value)
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
          this.formaE.reset();
        });
        mm.onHidden.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.formaE.reset();
        });
        mm.onTap.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.formaE.reset();
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
