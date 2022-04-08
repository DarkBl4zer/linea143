import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from "rxjs/operators";
 
const base_url = environment.base_urlMsy;


@Injectable({
  providedIn: 'root'
})
export class ListasService {

  constructor(private http: HttpClient) { }

  // crear cabecera de solicitud
  urlBase ( query: string ){
    var toke = localStorage.getItem('token');
    const url  = `${base_url}/${query}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.get(url, {headers});
  }

  getMesaAyuda(){
    return this.urlBase(`msy/mesasDeAyuda.php`);
  }
  
  getTipoSolicitud(datos){
  
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/msy/Solicitudes.php`,{ datos }, {headers});
  }
  getAsistencia(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/msy/Asistencias.php`,{ datos }, {headers});
  }
  getServicio(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/msy/Servicios.php`,{ datos }, {headers});
  }
  getDetalleServicio(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/msy/ServiciosDetalle.php`,{ datos }, {headers});
  }
  getElementos(){
    return this.urlBase(`msy/elementos.php`);
  }
  reporteSolicitudes(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/msy/historicoMesasAyuda.php`,{ datos }, {headers});
  }
  detalleSolicitud(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/msy/detalleSolicitud.php`,{ datos }, {headers});
  }

}
