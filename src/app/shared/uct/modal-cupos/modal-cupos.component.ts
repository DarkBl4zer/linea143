import { Component, OnInit, Input  } from '@angular/core';
import { ConsultasistemaService } from '../../../services/uct/consultasistema.service';
import { ListasService } from '../../../services/uct/listas.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FrmorientadirService} from '../../../services/uct/frmorientadir.service';

@Component({
  selector: 'app-modal-cupos',
  templateUrl: './modal-cupos.component.html',
  styles: [
  ]
})
export class ModalCuposComponent implements OnInit {
  @Input() fecha: string;
  historicoCupos: any[] = [];
  loading: boolean;
  loadingData: boolean;
  dtOptions: DataTables.Settings = {};
  temaL: any[] = [];
  jornadaL: any[] = [];
  unidadGesL: any[] = [];
  formaD: FormGroup;
  constructor( private consultaSis: ConsultasistemaService,
    private listas: ListasService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private frmOriDir: FrmorientadirService,) {
   
  }

  ngOnInit(): void {
    this.loadingData = true;
    this.consultarCupos();
    this.crearFormulario();
    this.listasFrm();
  }

  consultarCupos(){
    var datos = {
      "fecha": this.fecha,
    };
    this.consultaSis.getCupos(datos)
    .subscribe( (rsp: any) => {
      this.historicoCupos = [];
      this.historicoCupos = rsp['cuposAtuales'];
      this.loading = false;
      this.loadingData = false;
    });
  }

  listasFrm(){
    //Unidad fe gestion
    this.listas.getUnidadGestion()
    .subscribe( (rsp: any) => {
      if(rsp === undefined){
        console.log("entro");
        this.toastr.error('Debe salir e ingresar del sistema ya que sus datos de sesion han expirado por el tiempo de inactividad', 'Atención ', {
          timeOut: 4000,
        });
      }
      this.unidadGesL = rsp;
      //console.log(rsp);
    });
    //lista temas
    this.listas.getTema()
    .subscribe( (rsp: any) => {
      this.temaL = rsp;
    });
    //lista temas
    this.listas.getJornadaAll()
    .subscribe( (rsp: any) => {
      this.jornadaL = rsp;
    });
  }
  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    
      this.formaD = this.fb.group({
        uniGest: ['',Validators.required],
        consecFunc:[localStorage.getItem('consecUsr')],
        ccFunc:[localStorage.getItem('ccUsr')],
        idDep:[localStorage.getItem('idDepUsr')],
        temaId:['', Validators.required],
        fecha:[this.fecha],
        jornadaId:['', Validators.required],
        cupos:['', [Validators.required ,Validators.pattern("^[0-9]*$"),Validators.minLength(1),Validators.maxLength(3)]],
      });
  }
  //Validar los campos obligatorios
  nombreInvalido(campo){
    return this.formaD.get(campo).invalid && this.formaD.get(campo).touched;
  }
  //RegistrarFrm
  guardar(){
    this.loading=false;
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
    this.frmOriDir.registrarCupos(this.formaD.value)
    .subscribe( e => {
      
      if(e['status'] === 500){
        this.consultarCupos();
        this.loading=true;
        this.toastr.error(e['mensaje'], 'Atención ', {
          timeOut: 5000,
        });
      }else if(e['status'] === 200){
        this.consultarCupos();
        this.loading=true;
        this.toastr.success(e['mensaje'], 'Proceso Exitoso ', { 
          timeOut: 2000,
          enableHtml: true,
          progressBar:true,
          closeButton: true,
        });
      }
    });
    this.loading = true;
  }

}
