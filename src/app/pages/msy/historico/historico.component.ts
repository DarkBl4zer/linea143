import { Component, OnInit  } from '@angular/core';
import { ListasService } from '../../../services/msy/listas.service';
import { environment } from '../../../../environments/environment';
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styles: [
  ]
})
export class HistoricoComponent implements OnInit {

  constructor(
    private listas:ListasService) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: this.idiomaEnv,
      processing: true,
      paging: true,
    };
    this.cargarData()
  }

  loading: boolean = true;
  msg: boolean = true;
  historicActivos: any[] = [];
  historicoFinalizados: any[] = [];
  idiomaEnv = environment.languages;
  dtOptions: DataTables.Settings = {};
  fileName= 'ExcelSheet.xlsx'; 

  cargarData(){
    var datos = {
      //"ccSolicitante":localStorage.getItem('ccUsr'),
      "ccSolicitante":1010213817,
    };
   
    this.listas.reporteSolicitudes(datos)
    .subscribe( (rsp: any) => {
      console.log(rsp);
      this.historicActivos = [];
      this.historicActivos = rsp[0]['mesasActivas'];
      this.historicoFinalizados = [];
      this.historicoFinalizados = rsp[0]['mesasaArchivadas'];
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
