import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from "rxjs/operators";
 
const base_url = environment.base_url;

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

  getTipoAtencion(){
    return this.urlBase(`tipoAtencion/activas`)
    .pipe( map(data => data['listaTipoAtncion'] ));
  }
  getFormaIngreso(){
    return this.urlBase(`formaIngreso/activas`)
    .pipe( map(data => data['listaFormasIng'] ));
  }
  getLocalidad(){
    return this.urlBase(`localidad/activas`)
    .pipe( map(data => data['listaLocalidad'] ));
  }
  getTipoDoc(){
    return this.urlBase(`tipoDoc/activas`)
    .pipe( map(data => data['listaTipoDoc'] ));
  }
  getPais(){
    return this.urlBase(`pais/activas`)
    .pipe( map(data => data['listaPais'] ));
  }
  getPmr(){
    return this.urlBase(`pmr/activas?idGrupo=1`)
    .pipe( map(data => data['listaPmr'] ));
  }
  getPmrPrincipal(){
    return this.urlBase(`pmrPrincipal/activas?idGrupo=1&idDep=394`)
    .pipe( map(data => data['listaPmr'] ));
  }
  
  getPmrSecundario(valor){
    return this.urlBase(`pmrSecunadrio/activas?indicaP=${valor}`)
    .pipe( map(data => data['listaPmr'] ));
  }
  getGenero(){
    return this.urlBase(`genero/activas`)
    .pipe( map(data => data['listaGenero'] ));
  }
  getTema(){
    return this.urlBase(`tema/activas`)
    .pipe( map(data => data['listaTemas'] ));
  }
  getJornadaAll(){
    return this.urlBase(`jornada/activas`)
    .pipe( map(data => data['listaJornadas'] ));
  }
  getUnidadGestion(){
    return this.urlBase(`unidadGes/activas`)
    .pipe( map(data => data['listaUnidadGes'] ));
  }

  getDependencia(){
    return this.urlBase(`dependencias/activas`)
    .pipe( map(data => data['listaDependencias'] ));
  }
  

  getJornada(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/jornada`, { datos }, {headers});
  }

  getFuncionariosActivos(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/funcionarios/activos`,{ datos }, {headers});
  }
  getFuncionariosSinFiltro(){
    return this.urlBase(`funcionarios`)
    .pipe( map(data => data['usuariosActivos'] ));
  }

  getActuaciones(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/actuaciones`,{ datos }, {headers});
  }

  getEntidades(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}`
    });
    return this.http.post( `${base_url}/entidades`,datos, {headers});
  }

/*
  getJornada(datos){
    return this.http.post( `${base_url}/cupos/tema`, { datos } );
  }
*/
}
