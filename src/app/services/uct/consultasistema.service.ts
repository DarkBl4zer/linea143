import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment';

const base_url = environment.base_url; 


@Injectable({
  providedIn: 'root'
})
export class ConsultasistemaService {

  constructor(private http: HttpClient) { }
 
  urlBase ( query: string ){
    var toke = localStorage.getItem('token');
    const url  = `${base_url}/${query}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.get(url, {headers});
  }

  getCasosActivos(){
    return this.urlBase(`sistema/casosActivos`)
    .pipe( map(data => data['casosActivos'] ));
  }
  
  postAsignacionCaso(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/registroAgenda/asignacion`,{ datos }, {headers} );
  }

  getDatosSolicitud(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/datosCaso`,{ datos }, {headers});
  }

  getCupos(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/actualesCupos`,{ datos }, {headers});
  }

  getCasosACtivos(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/misPendientes`,{ datos }, {headers})
    .pipe( map(data => data['casosActivos'] ));
  }

  getCasosFunc(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/activosFunc`,{ datos }, {headers})
    .pipe( map(data => data['casosActivos'] ));
  }
  //Verificar si la dependeica es igual a mi actual dependencia
  verificarRemDep(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/dependenciaComp`,{ datos }, {headers});
  }

  getHistoricoCaso(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/historicoCaso`,datos, {headers})
    .pipe( map(data => data['historicoCaso'] ));
  }


  detalleDocActuacion(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/detalleDocActuacion`,datos, {headers})
    .pipe( map(data => data['detalleDocActuacion'] ));
  }

  verificarPmryEje(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/verificarPmrEje`,datos, {headers});
  }

  
  solicitarReporte(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/sistema/reporteFrmExpress`,datos, {headers});
  }





}
