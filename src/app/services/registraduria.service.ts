import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from "rxjs/operators";
import { environment } from '../../environments/environment';

const base_url = environment.base_url; 

@Injectable({
  providedIn: 'root'
})
export class RegistraduriaService {

  constructor(private http: HttpClient) { }

  
    urlBase ( query: string ){
      var toke = localStorage.getItem('token');
      const url  = `${base_url}/${query}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${toke}`
      });
      return this.http.get(url, {headers});
    }

    getDatosCiu(numDoc){
      return this.http.get(`https://apps.personeriabogota.gov.co/wsreg/index.php?doc=${numDoc}`)
      .pipe( map(data => data['return'] ))
      .pipe( map(data => data['datosCedulas'] ))
      .pipe( map(data => data['datos'] ))
    }
 
    getDatosCiuPerso(numDoc){
      return this.urlBase(`ciudadano/datosPersonales?numDoc=${numDoc}`)
      .pipe( map(data => data['datosCiudadano'] ));
    }
    getHistoricoSolicitudes(numDoc){
      return this.urlBase(`ciudadano/historico?numDoc=${numDoc}`)
      .pipe( map(data => data['historialCiudadano'] ));
    }
}
