import { Component, OnInit, Input  } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { ConsultasistemaService } from '../../../services/uct/consultasistema.service';
import { environment } from '../../../../environments/environment';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-reportuct',
  templateUrl: './reportuct.component.html',
  styles: []
})
export class ReportuctComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private consuSis: ConsultasistemaService) {

  }

  ngOnInit(): void {
    this.dtOptions = {
      language: this.idiomaEnv,
      processing: true,
      paging: false,
    };
    this.crearFormulario();
    this.loading = true;
  }


  forma: FormGroup;
  loading: boolean = true;
  msg: boolean = true;
  historico: any[] = [];
  idiomaEnv = environment.languages;
  dtOptions: DataTables.Settings = {};
  fileName= 'ExcelSheet.xlsx'; 

  //Crear campos y atributos validadores a campos de formulario
  crearFormulario(){
    this.forma =this.fb.group({
      fechaI:['',Validators.required],
      fechaF:['',Validators.required],
    });
  }

  //Validar los campos obligatorios
  nombreInvalido(campo){
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }
  guardar(){

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

    this.msg = false;

    const format = 'dd/MM/YYYY';
    const locale = 'en-US';
    this.forma.get('fechaI').setValue(formatDate(this.forma.get('fechaI').value, format, locale));
    this.forma.get('fechaF').setValue(formatDate(this.forma.get('fechaF').value, format, locale));
  
    this.consuSis.solicitarReporte(this.forma.value)
    .subscribe( (rsp: any) => {
      console.log(rsp['datosCaso']);
      this.historico = [];
      this.historico = rsp['datosCaso'];
      this.msg = true;
      this.loading = false;
    });
  }

  exportexcel(): void {
    /* table id is passed over here */   
    let element = document.getElementById('demo-foo-addrow'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

}
