import { Component, OnInit, Input  } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ListasService } from '../../../services/uct/listas.service';
import { ConsultasistemaService } from '../../../services/uct/consultasistema.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { map } from "rxjs/operators";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-modalreasignar',
  templateUrl: './modalreasignar.component.html',
  styles: [
  ]
})
export class ModalreasignarComponent implements OnInit {

  @Input() sinproc: string;
  funcionariosActivos: any[] = [];
  loadingData: boolean;
  formaD: FormGroup;
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

  constructor(private modal:NgbModal,
    private listas: ListasService,
    private consultaSis: ConsultasistemaService,
    private toastr: ToastrService,
    private fb: FormBuilder,) { }
    

  ngOnInit(): void {
    console.log(this.sinproc);
  }
  openXL(contenido){
    //this.loadingData = true;
    this.modal.open(contenido,{size:'xl'});
    this.consultarDatos();
  }
  consultarDatos(){
    var datos = { "numSolicitud": this.sinproc };
    this.consultaSis.getDatosSolicitud(datos)
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
  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    this.formaD =this.fb.group({
      observacionC:['',Validators.required],
    });
  }
  //Validar los campos obligatorios
  nombreInvalido(campo){
    return this.formaD.get(campo).invalid && this.formaD.get(campo).touched;
  }
    //Registrar infromacion en sistema
    guardar(){

      //verificar si todos los campos se diligenciaron 
      console.log(this.formaD.valid);
      console.log(this.formaD.value);
  
      if(!this.formaD.valid) {
        this.toastr.error('verifique y complete los campos faltantes', 'Atención ', {
          timeOut: 5000,
        });
        return Object.values(this.formaD.controls).forEach( control =>{
          if (control instanceof FormGroup){
            Object.values(control.controls).forEach( control => control.markAllAsTouched());
          }else{
            control.markAllAsTouched();
          }
        })
      }
  
  
      //cargar vista de loading
      this.loading = true;
    }

}
