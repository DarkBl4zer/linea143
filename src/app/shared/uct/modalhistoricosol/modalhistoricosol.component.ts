import { Component, OnInit, Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { RegistraduriaService } from '../../../services/registraduria.service';

@Component({
  selector: 'app-modalhistoricosol',
  templateUrl: './modalhistoricosol.component.html',
  styles: [
  ]
})

export class ModalhistoricosolComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @Input() numId: any;
  historico: any[] = [];
  loading: boolean = true;
  constructor(
    private modal:NgbModal,
    private registraduria: RegistraduriaService) { 
    }
    ngOnInit(): void {
      this.llamarHistorico();
    }

    llamarHistorico(){
      this.registraduria.getHistoricoSolicitudes(this.numId)
      .subscribe( (rsp: any) => {
        this.historico = [];
        this.historico = rsp;
        this.loading = false;
      });
    }
    
  openXL(contenido){
    this.modal.open(contenido,{size:'xl'});
  }



}
