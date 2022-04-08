import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ConsultasistemaService } from '../../../services/uct/consultasistema.service';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styles: [
  ]
})
export class AgendaComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  historico: any[] = [];
  datosCargados: boolean = true;
  idiomaEnv = environment.languages;

  constructor( private consultaS: ConsultasistemaService  ) {
 
  }

  ngOnInit(): void {
    this.dtOptions = {
      language: this.idiomaEnv,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
    };
    this.llamarHistorico();
  }

  llamarHistorico(){
    this.consultaS.getCasosActivos()
    .subscribe( (rsp: any) => {
      this.historico = [];
      this.historico = rsp;
      this.datosCargados = false;
    });
  }

}
