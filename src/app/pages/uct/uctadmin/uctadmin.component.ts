import {Component,ChangeDetectionStrategy,OnInit,ViewChild} from '@angular/core';
import {CalendarEvent,CalendarView} from 'angular-calendar';
import { formatDate,registerLocaleData  } from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ListasService } from '../../../services/uct/listas.service';
import localeEs from '@angular/common/locales/es';



@Component({
  selector: 'app-uctadmin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uctadmin.component.html',
  styleUrls: ['./uctAdmin.component.css'],
})

export class UctadminComponent implements OnInit {
  
  @ViewChild('contenido') contenido: any;
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  events: CalendarEvent[] = [];
  CalendarView = CalendarView;
  fechaClick;

  
  constructor(
    private modal:NgbModal,
  ) { 
    registerLocaleData(localeEs);  
  }

  ngOnInit(): void {  
  }

  dayClicked({ date }: { date: Date; events: CalendarEvent[] }): void {
    const format = 'dd/MM/YYYY';
    const locale = 'es-Es';
    this.fechaClick = formatDate(date, format, locale);
    this.modal.open(this.contenido,{size:'xl'});
  }

  setView(view: CalendarView) {
    this.view = view;
  }
}
