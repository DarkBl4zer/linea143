import { Component, OnInit, Input  } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ConsultasistemaService } from '../../../services/uct/consultasistema.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrls: ['./datos-solicitud.component.css']
})
export class DatosSolicitudComponent implements OnInit {

  @Input() sinproc: string;
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


  nomreg: string;
  apellreg: string;
  pmri: string;
  pmrs: string;

  constructor(private modal:NgbModal,
    private consultaSis: ConsultasistemaService,) { }

  ngOnInit(): void {
  }

  openXLInfo(contenido){
    //this.loadingData = true;
    this.modal.open(contenido,{size:'xl'});
    this.consultarDatos();
  }

  consultarDatos(){
    var datos = { "numSolicitud": this.sinproc };
    this.consultaSis.getDatosSolicitud(datos)
    .pipe( map(rsp => rsp['datosCaso'] ))
    .subscribe( (rsp: any) => {
      console.log(rsp);
      //Datos ciudadano
      this.nombreApe= rsp[0]['texto01']+' '+rsp[0]['texto02']+' '+rsp[0]['texto03']+' '+rsp[0]['texto04'];
      this.numDoc =  rsp[0]['sicsigla']+': '+rsp[0]['id_usuario_reg'];  
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
      //Datos extra de registro
      this.nomreg= rsp[0]['nomreg']
      this.apellreg= rsp[0]['apellreg']
      this.pmri= rsp[0]['pmri']
      this.pmrs= rsp[0]['pmrs']
    });
    
  }

}
