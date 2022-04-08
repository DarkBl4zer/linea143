import { Component, OnInit, } from '@angular/core';
import { ConsultasistemaService } from '../../services/uct/consultasistema.service';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListasService } from '../../services/uct/listas.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FrmorientadirService} from '../../services/uct/frmorientadir.service'; 
import { formatDate } from '@angular/common';
import { FormariosService} from '../../services/msy/formarios.service'; 
//import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-mispendeintes',
  templateUrl: './mispendeintes.component.html',
  styleUrls: ['./mispendeintes.component.css'],
})

export class MispendeintesComponent implements OnInit {
  maxDate = new Date;
  loading: boolean;
  historico: any[] = [];
  idiomaEnv = environment.languages;
  dtOptions: DataTables.Settings = {};
  sinproc;
  //REMISION
  formaR : FormGroup;
  dependL: any[] = [];
  funcionariosL: any[] = [];
  tipoRemision;
  nombreJefe;
  apellidoJefe;
  loadRemicion: boolean;
  //ACTUACION
  formaA : FormGroup;
  formData = new FormData();
  file1: File;
  actuaionesL: any[] = [];
  loadActuacion: boolean;

  //HISTORICO
  historicoTransaccion: any[] = [];
  detalleDocActuacion: any[] = [];

  //ARCHIVO
  formaARC : FormGroup;
  archiExt: boolean;
  entidaddesList: any[] = [];
  pmrGrupoGes: any[] = [];
  pmrI: any[] = [];
  pmrS: any[] = [];
  loadingPmrS: boolean;
  definePmr: boolean;
  idTramite:any;

  constructor( 
    private sistema:ConsultasistemaService,
    private modal:NgbModal,
    private listas:ListasService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private frmOriDir: FrmorientadirService,
    private msyS:FormariosService
) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: this.idiomaEnv,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
    };
    this.loading = true;
    this.casosActivos();
  }
  casosActivos(){
    //var datos = { "consec": localStorage.getItem('consecUsr') };
    var datos = { "consec": 52421730 };
    this.sistema.getCasosACtivos(datos)
    .subscribe( (rsp: any) => {
      this.historico = [];
      this.historico = rsp;
      this.loading = false;
    });
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //*****************SECCION HISTORICO TRANSACCION *******************
  openXLH(contenedor,numSolicitud,vigencia,idTramite){

    this.historicoTransaccion = [];
    this.detalleDocActuacion = [];
    var datos = { 
      "numSolicitud": numSolicitud,
      "idTramite":idTramite,
      "vigencia":vigencia
    };

    this.sistema.getHistoricoCaso(datos)
    .subscribe( (rsp: any) => {
      this.historicoTransaccion = [];
      this.historicoTransaccion = rsp;
      let arr = rsp['archivo'].split(',');
    });
    
    this.modal.open(contenedor,{size:'lg'});
  }
  openXLHH(contenedor,consec){
    this.detalleDocActuacion = [];
    var datos = { 
      "consecutivo": consec
    };
    this.sistema.detalleDocActuacion(datos)
    .subscribe( (rsp: any) => {

      if(rsp['status'] === 500){
        this.toastr.error(rsp['mensaje'], 'Atención ', {
          timeOut: 5000,
        });
      }
      this.detalleDocActuacion = [];
      this.detalleDocActuacion = rsp;
    });
    
    this.modal.open(contenedor,{size:'lg'});
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //****************** SECCION ACTUACION *****************************
  openXLA(contenedor,numSolicitud,vigencia,idTramite){
    this.sinproc=numSolicitud;
    this.crearFormularioA();

    var datos = { "idTramite": idTramite };
    this.listas.getActuaciones(datos)
    .subscribe( (rsp: any) => {
      this.actuaionesL = rsp['listaActuaciones'];
    });

    this.formaA.patchValue({
      sinproc: numSolicitud, 
      vigencia: vigencia, 
      idTramite: idTramite
    });
    this.loadActuacion = false;
    this.modal.open(contenedor,{size:'xl'});

  }

  nombreInvalidoAct(campo){
    return this.formaA.get(campo).invalid && this.formaA.get(campo).touched;
  }
  crearFormularioA(){
    this.formaA =this.fb.group({
      tipoGestion: ['',Validators.required],
      fecFin: ['',Validators.required],
      descripPretensiones:['',Validators.required],
      sinproc:[],
      idTramite:[],
      vigencia:[],
      Fichier1:null,
      Fichier2:null,
      Fichier3:null,
    });
  }
  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formaA.get('Fichier1').setValue({
          name: file.name,
          type: file.type,
          size: file.size,
          value: (<string>reader.result).split(',')[1]
        })
      };
    }
  }
  onFileChange2(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formaA.get('Fichier2').setValue({
          name: file.name,
          type: file.type,
          size: file.size,
          value: (<string>reader.result).split(',')[1]
        })
      };
    }
  }
  onFileChange3(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formaA.get('Fichier3').setValue({
          name: file.name,
          type: file.type,
          size: file.size,
          value: (<string>reader.result).split(',')[1]
        })
      };
    }
  }
  regActuacion(){

    if(!this.formaA.valid) {
      this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
        timeOut: 5000,
      });
      this.formaA.get('fecFin').setValue('');
      return Object.values(this.formaA.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }

    const format = 'dd/MM/YYYY';
    const locale = 'en-US';
    this.formaA.get('fecFin').setValue(formatDate(this.formaA.get('fecFin').value, format, locale));

    this.loadActuacion = true;
    this.frmOriDir.registrarActuacion(this.formaA.value)
    .subscribe(
      (response) => {                         
        if(response['status'] === 500){
          this.toastr.error(response['mensaje'], 'Atención ', {
            timeOut: 5000,
          });
          this.formaA.get('fecFin').setValue('');
          this.loading = false;
        }else if(response['status'] ===  200){
            this.toastr.success(response['mensaje'], 'Proceso Exitoso ', { 
              timeOut: 5000,
              enableHtml: true,
              progressBar:true,
              closeButton: true,
            }
          );
        }
        this.loadActuacion = false;
      },
      (error) => {       
        console.log(error);
        var msg = "Ocurrio un problema en la transaccion :" +error['name'] + " ";
        this.toastr.error(msg, 'Atención ', {
          timeOut: 5000,
        });
        this.loading = false;


      }
    );


  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  //SECCION DE REGISTRO REMISION
  openXLR(contenedor,numSolicitud,vigencia,idTrmit){
    this.sinproc=numSolicitud;
    this.crearFormularioR();
    this.listas.getDependencia()
    .subscribe( (rsp: any) => {
      this.dependL = rsp;
    });

    this.formaR.patchValue({
      sinproc: numSolicitud, 
      vigencia: vigencia, 
      idTramite: idTrmit
    });
    this.modal.open(contenedor,{size:'xl'});
  }
  //Validar los campos obligatorios
  nombreInvalidoRem(campo){
    return this.formaR.get(campo).invalid && this.formaR.get(campo).touched;
  }
  crearFormularioR(){
    this.formaR =this.fb.group({
      idDepRemision: ['',Validators.required],
      descripPretensiones: ['',Validators.required],
      idUsuarioRemitir: [Validators.required],
      sinproc:[],
      idTramite:[],
      vigencia:[]
    });
  }
  cambioDep(valor){
    //VERIFICAR SI DEPENDENCIA ES LA MISMA
    var datos = {
      "dependencia": valor,
      "depActual": localStorage.getItem('idDepUsr')
      //"depActual": 80
    };
    this.formaR.patchValue({
      idDepRemision: valor, 
    });
    this.sistema.verificarRemDep(datos)
    .subscribe( e => {
      if(e['status']==200){
        if(e['valor']==0){
          this.formaR.patchValue({
            idUsuarioRemitir: '', 
          });
          this.funcionariosL = e['datosFuncionarios'];
          this.tipoRemision = 0;
        }else{
          this.formaR.patchValue({
            idUsuarioRemitir: '', 
          });
          this.nombreJefe = e['datosFuncionarios'][0]['nombre'];
          this.apellidoJefe = e['datosFuncionarios'][0]['apellido'];
          this.tipoRemision = 1;
          this.formaR.patchValue({
            idUsuarioRemitir: e['datosFuncionarios'][0]['consec'], 
          });
        }
      }else{
        this.loading=true;
        this.toastr.error('Problema al verificar los funcionarios del sistema', 'Atención ', {
          timeOut: 5000,
        });
      }1
    });    
  }
  regRemision(){
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

    this.frmOriDir.registrarRemision(this.formaR.value)
    .subscribe( e => {
      console.log(e);
      console.log(e['status']);
      if(e['status'] === 500){
        this.toastr.error(e['mensaje'], 'Atención ', {
          timeOut: 5000,
        });
        this.loading = false;

      }else if(e['status'] === 200){
          this.toastr.success(e['mensaje'], 'Proceso Exitoso ', { 
            timeOut: 5000,
            enableHtml: true,
            progressBar:true,
            closeButton: true,
          }
        );
        this.loading = false;
        setTimeout(function () {
          location.reload()
        }, 3000);
      }
    });

  }
 // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //*****************SECCION ARCHIVO  *******************************


  openXLAR(contenedor,numSolicitud,vigencia,idTramite){
    this.sinproc=numSolicitud;
    this.crearFormularioArc();
    this.formaARC.patchValue({
      sinproc: numSolicitud, 
      vigencia: vigencia, 
      idTramite: idTramite
    });
    this.idTramite=idTramite;
    console.log(this.idTramite);
    console.log(typeof this.idTramite);
    if(this.idTramite==='301'){
      console.log('SI ES 301');
    }else{
      console.log('NO ES 301');
    }

    this.verificarPmryEje();
    this.modal.open(contenedor,{size:'xl'});
  }
  //Verificar si existe pmr y si el eje es 3 o 1
  verificarPmryEje(){
    var datos = { "depActual": localStorage.getItem('idDepUsr') };
    //var datos = { "depActual": 316 };
    this.sistema.verificarPmryEje(datos)
      .subscribe( (rsp: any) => {

        const grupGes = this.formaARC.get('grupGes');
        const pmrI = this.formaARC.get('pmrI');
        const pmrS = this.formaARC.get('pmrS');
        
        if(rsp['pmr'][0]['pmr'] === "1" && (rsp['eje'][0]['eje'] === "1" || rsp['eje'][0]['eje'] === "3")){
          this.definePmr = true;
          //listas pmr grupo de getion 
          this.listas.getPmr()
          .subscribe( (rsp: any) => {
            this.pmrGrupoGes= rsp;
          });
          this.listas.getPmrPrincipal()
          .subscribe( (rsp: any) => {
            this.pmrI = rsp;
          });
          grupGes.setValidators(Validators.required);
          pmrI.setValidators(Validators.required);
          pmrS.setValidators(Validators.required);
        }else{
          grupGes.clearValidators();
          pmrI.clearValidators();
          pmrS.clearValidators();
          console.log("NO");
        }
    });
  }
  //Extraer PMR secundario en referencia del pmr inicial
  cambioPmrI(valor){
    const grupGes =this.formaARC.get('grupGes').value;
    this.listas.getPmrSecundario(valor)
    .subscribe( (rsp: any) => {
      this.pmrS = rsp;
      this.loadingPmrS = false;
    });
  }
  nombreInvalidoArc(campo){
    return this.formaARC.get(campo).invalid && this.formaARC.get(campo).touched;
  }
  crearFormularioArc(){
    this.formaARC =this.fb.group({
      remisionEntidadExterna: ['',Validators.required],
      tipoGestion: ['',Validators.required],
      datoMaterializado: ['',Validators.required],
      textoParaArchivo: ['',Validators.required],
      entidad: [''],
      idEntidadRemite: [''],
      sinproc:[],
      idTramite:[],
      vigencia:[],
      grupoGestion:[],
      pmrPrincipal:[],
      pmrSecundario:[],
      nomOtraEntidadRemite:[],
      codCorrespondencia:[]
    });
  }
  cambioArchivoExt(valor){
    if (valor==='1'){
      this.archiExt = true;
    }else{
      this.archiExt = false;
    }
  }
  listadoEntidad(value){
    var datos = { "option": value };
    if(value.length >= 3){
      this.listas.getEntidades(datos)
      .subscribe( (rsp: any) => {
        console.log(rsp);
        this.entidaddesList = rsp['entidades'];
      });
    }
  }
  onFileChangeArc(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formaARC.get('Fichier1').setValue({
          name: file.name,
          type: file.type,
          size: file.size,
          value: (<string>reader.result).split(',')[1]
        })
      };
    }
  }
  SeleccionEntidad(dato){
    this.formaARC.get('entidad').setValue(dato['nombre']);
    this.formaARC.get('idEntidadRemite').setValue(dato['id']);
    this.formaARC.get('nomOtraEntidadRemite').setValue(dato['nombre']);
    this.entidaddesList =[];
  }

  regArchivo(){
        if(!this.formaARC.valid) {
      this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
        timeOut: 5000,
      });
      return Object.values(this.formaARC.controls).forEach( control =>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAllAsTouched());
        }else{
          control.markAllAsTouched();
        }
      })
    }


    this.frmOriDir.registrarArchivo(this.formaARC.value)
    .subscribe( e => {
      if(e['status'] === 500){
        this.toastr.error(e['mensaje'], 'Atención ', {
          timeOut: 5000,
          enableHtml: true,
        });
        this.loading = false;

      }else if(e['status'] === 200){

        if(this.idTramite === '301'){
          this.msyS.envioEmailEncuesta(this.formaARC.value)
          .subscribe( e => {
            console.log(e);
          });
        }
        this.toastr.success(e['mensaje'], 'Proceso Exitoso ', { 
            timeOut: 5000,
            enableHtml: true,
            progressBar:true,
            closeButton: true,
          }
        );
        this.loading = false;
        setTimeout(function () {
          location.reload()
        }, 6000);
        
      }
    });

  }

}
