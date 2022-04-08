import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from "rxjs/operators";

const base_url = environment.base_urlMsy;

@Injectable({
  providedIn: 'root'
})
export class FormariosService {

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

  registrarFormulario(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}` 
    });
    const url = `${base_url}/msy/registroSolicitud.php`;
    return this.http.post( url, { datos }, {headers} );
  }

  regitroAprobacion(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}` 
    });
    const url = `${base_url}/msy/registroAprobacion.php`;
    return this.http.post( url, { datos }, {headers} );
  }
  envioEmailEncuesta(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}` 
    });
    const url = `${base_url}/msy/regEncuestaSatis.php`;
    return this.http.post( url, { datos }, {headers} );
  }
  regitroEncuentaUsr(datos){
    var toke = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${toke}` 
    });
    const url = `${base_url}/msy/registroEncuenta.php`;
    return this.http.post( url, { datos }, {headers} );
  }
  
}
