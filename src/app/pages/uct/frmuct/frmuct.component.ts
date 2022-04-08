import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ListasService } from '../../../services/uct/listas.service';
import { ToastrService } from 'ngx-toastr';
import { FrmorientadirService} from '../../../services/uct/frmorientadir.service';
import { RegistraduriaService } from '../../../services/registraduria.service';
import { formatDate } from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-frmuct',
  templateUrl: './frmuct.component.html',
  styles: ['']
})

export class FrmuctComponent implements OnInit {

  //Variables de inicio del componente
  minDate = new Date;
  forma: FormGroup;
  public formSubmitted = false;  
  loading: boolean;
  loadingCupo: boolean;
  loadingUsr: boolean = false;
  loadingPmrS: boolean;
  histUsr: boolean = false;
  numId: number;
  
  //lista de elemntos provenientes de un https 
  tipoAtenExt: boolean;
  atencion: any[] = [];
  fomraIng: any[] = [];
  localidad: any[] = [];
  tipoDoc: any[] = [];
  pais: any[] = [];
  pmr: any[] = [];
  pmrI: any[] = [];
  pmrS: any[] = [];
  vulner: any[] = [];
  generoL: any[] = [];
  temaL: any[] = [];
  jornadaL: any[] = [];
  unidadGesL: any[] = [];
  //jornadaId: any[] = [];
 
  //adicion de servicios y llamdos basicos
  constructor(
    private fb: FormBuilder,
    private listas: ListasService,
    private toastr: ToastrService,
    private frmOriDir: FrmorientadirService,
    private registraduria: RegistraduriaService
  ) {
    this.listasFrm();
  }
  //funciones al cargar componente
  ngOnInit(): void {
    this.loading = true;
  }
  //Listas necesaria apra el formulario
  listasFrm(){
    this.crearFormulario();
    //tipo atencion
    this.listas.getTipoAtencion()
    .subscribe( (rsp: any) => {
      this.atencion = rsp;
    });
    //Unidad fe gestion
    this.listas.getUnidadGestion()
    .subscribe( (rsp: any) => {
      this.unidadGesL = rsp;
      //console.log(rsp);
    });
    //forma ingreso
    this.listas.getFormaIngreso()
    .subscribe( (rsp: any) => {
      if(rsp === undefined){
        
        this.toastr.error('Debe salir e ingresar del sistema ya que sus datos de sesion han expirado por el tiempo de inactividad', 'Atención ', {
          timeOut: 4000,
        });
      }
      this.fomraIng = rsp;
    });
    //localidades
    this.listas.getLocalidad()
    .subscribe( (rsp: any) => {
      this.localidad = rsp;
    });
    //Lista tipo doc
    this.listas.getTipoDoc()
    .subscribe( (rsp: any) => {
      this.tipoDoc = rsp;
    });
    //Lista genero
    this.listas.getGenero()
    .subscribe( (rsp: any) => {
      this.loading=false;
      this.generoL = rsp;
    });
    //lista temas
    this.listas.getTema()
    .subscribe( (rsp: any) => {
      this.temaL = rsp;
    });
    //lista paises
    this.listas.getPais()
    .subscribe( (rsp: any) => {
      this.pais = rsp;
    });
    //listas pmr
    this.listas.getPmr()
    .subscribe( (rsp: any) => {
      this.pmr = rsp;
    });
    this.listas.getPmrPrincipal()
    .subscribe( (rsp: any) => {
      this.pmrI = rsp;
    });
  }
  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    this.forma =this.fb.group({
      formaIng: ['',Validators.required],
      tipoAten: ['',Validators.required],
      uniGest: ['',Validators.required],
      tipoId:['', Validators.required],
      numId:['', [Validators.required ,Validators.pattern("^[0-9]*$") ]],
      primNom:['', [Validators.required,Validators.minLength(2)]],
      segNom:[''],
      primApe:['', [Validators.required,Validators.minLength(2)]],
      segApe:[''],
      telUno:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      telDos:['', Validators.pattern("^[0-9]*$")],
      email:['',Validators.required],
      direc:['', Validators.required],
      localidad:['', Validators.required],
      nacionalidad:['', Validators.required],
      grupGes:['',Validators.required],
      pmrI:['',Validators.required],
      pmrS:['',Validators.required],
      observacion:[''],
      consecFunc:[localStorage.getItem('consecUsr')],
      ccFunc:[localStorage.getItem('ccUsr')],
      idDep:[localStorage.getItem('idDepUsr')],
      fecha:[''],
      temaId:[''],
      jornadaId:[''],
      genero:['',Validators.required],
    });
  }
  //Adicionar elementos a lista
  //Fin Aelementos a lista

  //Extraer PMR secundario en referencia del pmr inicial
  cambioPmrI(valor){
    const grupGes =this.forma.get('grupGes').value;    
    //Validar campos previos requeridos
    if( grupGes === ""){
      this.toastr.error('Debe seleccionar inicialmente el grupo de gestion.', 'Atención ', {
        timeOut: 4000,
      });
      this.forma.get('pmrI').reset();
      this.forma.get('pmrS').reset();
    }else{
      this.listas.getPmrSecundario(valor)
      .subscribe( (rsp: any) => {
        this.pmrS = rsp;
        this.loadingPmrS = false;
      });
    }
  }
  //Al cambiar tipo de atencion activar agenda o no
  cambioTipoAten(valor){

    const fecha = this.forma.get('fecha');
    const temaId = this.forma.get('temaId');
    const jornadaId = this.forma.get('jornadaId');
    
    if(valor === '2'){

      this.tipoAtenExt = true;
     
      this.forma.get('grupGes').reset();
      this.forma.get('pmrI').reset();
      this.forma.get('pmrS').reset();
      this.forma.get('grupGes').setValue(1);
      this.forma.controls['pmrI'].enable();
      this.forma.controls['grupGes'].enable();
      fecha.setValidators(Validators.required);
      temaId.setValidators(Validators.required);
      jornadaId.setValidators(Validators.required);
    }else{
      this.forma.get('grupGes').setValue(1);
      this.forma.get('pmrI').setValue(3947);
      this.cambioPmrI(3947);
      fecha.clearValidators();
      temaId.clearValidators();
      jornadaId.clearValidators();
      this.forma.controls['pmrI'].disable();
      this.forma.controls['grupGes'].disable();
      this.tipoAtenExt = false; 
    }
    fecha.updateValueAndValidity();
    temaId.updateValueAndValidity();
    jornadaId.updateValueAndValidity();
  }
  //Cambio tipo Doc
  cambioTipoDoc(){
    this.forma.get('numId').reset();
    this.forma.get('primNom').reset();
    this.forma.get('segNom').reset();
    this.forma.get('primApe').reset();
    this.forma.get('segApe').reset();
    this.forma.get('email').reset();
    this.forma.get('direc').reset();
    this.forma.get('telUno').reset();
    this.forma.get('telDos').reset();
  }
  //Validar los campos obligatorios
  nombreInvalido(campo){
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }
  //Registrar infromacion en sistema
  guardar(){

    //verificar si todos los campos se diligenciaron 

    if(!this.forma.valid) {
      this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.forma.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }

    var telU = this.forma.get('telUno').value;
    if( parseInt(telU.length)  === 7 || parseInt(telU.length)  ===  10){
    }else{
      this.toastr.error('verifique la cantidad de caracteres en el telefono Uno. solo son permitidos 7(Local) o 10 (Celular)', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.forma.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }

    //cargar vista de loading
    this.loading = true;
    //Enviar infromacion al backend
    var tipoAtencion = this.forma.get('tipoAten').value;
    var fechaOrg = this.forma.get('fecha').value;

    if(tipoAtencion === '2'){
      const format = 'dd/MM/YYYY';
      const locale = 'en-US';
      this.forma.get('fecha').setValue(formatDate(this.forma.get('fecha').value, format, locale));
    }

    this.forma.controls['pmrI'].enable();
    this.forma.controls['grupGes'].enable();

    this.frmOriDir.registrarFormulario(this.forma.value)
    .subscribe( e => {
      if(e['status'] === 500){
        this.toastr.error(e['mensaje'], 'Atención ', {
          timeOut: 5000,
        });
        this.loading = false;
        this.forma.get('fecha').setValue(fechaOrg);
      }else if(e['status'] === 200){
        const mm = this.toastr.success(e['mensaje'], 'Proceso Exitoso ', { 
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
          this.forma.reset();
        });
        mm.onHidden.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.forma.reset();
        });
        mm.onTap.subscribe((close) => {
          this.loading = false;
          location.reload();
          this.forma.reset();
        });

      }
    });
  }
  //Verificar infromacion y extraer datos ya sea de registraduria o personeria
  changeCc(valor){
    var tipoDoc =this.forma.get('tipoId').value;
    var errorReg;
    
    if(tipoDoc === ""){
      this.toastr.error('Debe seleccionar primero un tipo de identificacion', 'Atención ', {
        timeOut: 4000,
      });
      this.forma.get('numId').reset();
      this.loadingUsr = false;
    }
    this.forma.get('primNom').reset();
    this.forma.get('segNom').reset();
    this.forma.get('primApe').reset();
    this.forma.get('segApe').reset();
    this.forma.get('email').reset();
    this.forma.get('direc').reset();
    this.forma.get('telUno').reset();
    this.forma.get('telDos').reset();

    if(tipoDoc === '1'){
      this.numId=valor;
      this.histUsr= false;
      this.loadingUsr = true;

      setTimeout(() => {

        this.registraduria.getDatosCiu(valor)
        .subscribe( (rsp: any) => {
          if(rsp['codError'] === "0"){
            errorReg = rsp['codError'];
            //add valores a inputs
            this.forma.get('primNom').setValue(rsp['primerNombre']);
            this.forma.get('segNom').setValue(rsp['segundoNombre']);
            this.forma.get('primApe').setValue(rsp['primerApellido']);
            this.forma.get('segApe').setValue(rsp['segundoApellido']);
            this.registraduria.getDatosCiuPerso(valor)
            .subscribe( (rsp: any) => {
              this.forma.get('direc').setValue(rsp['domicilio_notificaciones']);
              this.forma.get('email').setValue(rsp['email']);
              this.forma.get('telUno').setValue(rsp['telefono']);
              this.forma.get('telDos').setValue(rsp['telefono2']);
            });
          }else{
            this.registraduria.getDatosCiuPerso(valor)
            .subscribe( (rsp: any) => {
              this.forma.get('primNom').setValue(rsp['nombre']);
              this.forma.get('primApe').setValue(rsp['apellido']);
              this.forma.get('direc').setValue(rsp['domicilio_notificaciones']);
              this.forma.get('email').setValue(rsp['email']);
              this.forma.get('telUno').setValue(rsp['telefono']);
              this.forma.get('telDos').setValue(rsp['telefono2']);
            });
          }
          this.loadingUsr = false;
          this.histUsr = true;
        });

     }, 5000);

    }else{
      this.numId=valor;
      this.histUsr= true;
      this.loadingUsr = true;
        this.registraduria.getDatosCiuPerso(valor)
        .subscribe( (rsp: any) => {
          this.forma.get('primNom').setValue(rsp['nombre']);
          this.forma.get('primApe').setValue(rsp['apellido']);
          this.forma.get('direc').setValue(rsp['domicilio_notificaciones']);
          this.forma.get('email').setValue(rsp['email']);
          this.forma.get('telUno').setValue(rsp['telefono']);
          this.forma.get('telDos').setValue(rsp['telefono2']);
        });
        this.loadingUsr = false;
        this.histUsr = true;
    }
  }
  //Funcion para limpiar campos al cambiar de fecha
  cambioFecha(type: string, event: MatDatepickerInputEvent<Date>) {
    this.forma.get('jornadaId').reset();
    this.forma.get('temaId').reset();
  }
  //Validar cambio unidad de gestion 
  cambioUniGes(){
    this.forma.get('jornadaId').reset();
    this.forma.get('temaId').reset();
    this.forma.get('fecha').reset();
  }
  //cambio grup ofgestion
  cambioGrupGes(){
    this.forma.get('pmrI').reset();
    this.forma.get('pmrS').reset();
  }
  //Verificar el tema y los cupos si aplica
  cambioTema(){
    const tipoAten = this.forma.get('tipoAten').value;
    const unidadGes =this.forma.get('uniGest').value;
    const format = 'dd/MM/YYYY';
    const locale = 'en-US';
    this.forma.get('jornadaId').reset();
    //Validar campos previos requeridos
    if(tipoAten === "" || unidadGes === ""){
      this.toastr.error('Debe seleccionar el tipo de atencion y la unidad de gestion para continuar', 'Atención ', {
        timeOut: 4000,
      });
      this.forma.get('temaId').reset();
    }

    //lCamio de formato y adicion de campos para validacion de cupos por jornada
    var datos = {
      "fecha": formatDate(this.forma.get('fecha').value, format, locale),
      "tema": this.forma.get('temaId').value,
      "unidadGes": unidadGes,
    };
    
    this.loadingCupo = true;

    this.listas.getJornada(datos)
    .subscribe( (rsp: any) => {
      if(rsp['status'] === 202){
        this.loadingCupo = false;
        this.jornadaL = rsp['listaJornadas'];
      }else{
        this.toastr.error(rsp['mensaje'], 'Atención ', {
          timeOut: 5000,
        });
        this.loadingCupo = false;
        this.forma.get('jornadaId').reset();
        this.forma.get('temaId').reset();
        this.forma.get('fecha').reset();
      }
    });
    

  }
  
}
