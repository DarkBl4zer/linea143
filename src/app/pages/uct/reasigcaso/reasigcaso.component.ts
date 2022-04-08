import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ConsultasistemaService } from '../../../services/uct/consultasistema.service';
import { ListasService } from '../../../services/uct/listas.service';
import { map } from "rxjs/operators";
import { FrmorientadirService} from '../../../services/uct/frmorientadir.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reasigcaso',
  templateUrl: './reasigcaso.component.html',
  styles: [
  ]
})
export class ReasigcasoComponent implements OnInit {
  formaE: FormGroup;
  historico: any[] = [];  
  funcionariosL: any[] = [];
  datosExiste: boolean;
  sinproc;

  funcionariosActivos: any[] = [];
  loadingData: boolean;
  nombreApe: string;
  numDoc: string;
  tel: string;
  email: string;
  direc: string;
  localidada: string;
  nacionalidada: string;
  genero: string;

  formaIng: string;
  unidadGes: string;

  fecha: string;
  tema: string;
  jornada: string;
  observacion: string;

  loading:boolean;
  loadingC: string;

  constructor(    
    private modal:NgbModal,
    private consuSis: ConsultasistemaService,
    private fb: FormBuilder,
    private listas: ListasService,
    private frmOriDir: FrmorientadirService,
    private toastr: ToastrService,) {
      this.listas.getFuncionariosSinFiltro()
      .subscribe( (rsp: any) => {
        this.funcionariosL = rsp;
      });
      this.crearFormulario(); 
     }
  ngOnInit(): void {
  }


  crearFormulario(){
    this.formaE = this.fb.group({
      idFunc: ['',Validators.required],
    });
  }

  cambioFuncionario(value){
    //llamar lista de asigaciones a cargo
    var datos = { "consec": value };
    this.consuSis.getCasosFunc(datos)
    .subscribe( (rsp: any) => {
      if(rsp.length >= 1){
        this.historico = [];
        this.datosExiste=true;
        this.historico = rsp;
      }else{
        this.historico = [];
        this.datosExiste=false;
      }
    });
  }

  openXL(contenido,sinprocS){
    //this.loadingData = true;
    this.sinproc= sinprocS;
    console.log(sinprocS);
    this.modal.open(contenido,{size:'xl'});
    this.consultarDatos();
  }
  consultarDatos(){
    var datos = { "numSolicitud": this.sinproc };
    this.consuSis.getDatosSolicitud(datos)
    .pipe( map(rsp => rsp['datosCaso'] ))
    .subscribe( (rsp: any) => {
      //Datos ciudadano
      this.nombreApe= rsp[0]['texto01']+' '+rsp[0]['texto02']+' '+rsp[0]['texto03']+' '+rsp[0]['texto04'];
      this.numDoc =rsp[0]['sicsigla']+': '+rsp[0]['id_usuario_reg'];  
      this.tel= rsp[0]['teluno']+' - '+rsp[0]['teldos'];
      this.email= rsp[0]['email'];
      this.direc= rsp[0]['direc'];
      this.localidada= rsp[0]['descloc'];
      this.nacionalidada= rsp[0]['sicpais'];
      this.genero= rsp[0]['genero'];
      //datos solicitud
      this.formaIng= rsp[0]['formaing'];
      this.unidadGes= rsp[0]['unidadges'];
      //Datos afendamiento
      this.fecha= rsp[0]['fecha01'];
      this.tema= rsp[0]['descripcion'];
      this.jornada= rsp[0]['jornada'];
      this.observacion= rsp[0]['obser'];
    });
    
  }
  nombreInvalido(campo){
    return this.formaE.get(campo).invalid && this.formaE.get(campo).touched;
  }
  guardar(valor){
    var datos = {
      "sinproc": this.sinproc,
      "observacion": valor,
      "consec": localStorage.getItem('consecUsr')
    };
    this.frmOriDir.retornoCaso(datos)
    .subscribe( e => {
      if(e['status'] === 500){
        this.loading=true;
        this.toastr.error(e['mensaje'], 'Atención ', {
          timeOut: 5000,
        });
      }else if(e['status'] === 200){
        this.loading=true;
        this.toastr.success(e['mensaje'], 'Proceso Exitoso ', { 
          timeOut: 2000,
          enableHtml: true,
          progressBar:true,
          closeButton: true,
        });
        setTimeout(function () {
          location.reload()
        }, 2000);
        this.historico = [];
      }
    });

  }

}
