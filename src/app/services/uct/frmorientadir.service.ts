import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FrmorientadirService {

  constructor(private http: HttpClient) { }

    // crear cabecera de solicitud
    urlBase ( query: string ){
      var toke = localStorage.getItem('token');
      const url  = `${base_url}/${query}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${toke}` 
      });
      return this.http.post(url, {headers});
    }

    registrarFormulario(datos){
      if(datos['tipoAten'] === '1'){
        var goTo='frmOrientacionDirecta/Reg';
      }else{
        var goTo='frmAgenda/Reg';
      }
      var toke = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${toke}` 
      });
      const url = `${base_url}/${goTo}`;
      return this.http.post( url, { datos }, {headers} );
    }

    registrarCupos(datos){
      var toke = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${toke}` 
      });
      const url = `${base_url}/frmCupos/Reg`;
      return this.http.post( url, { datos }, {headers} );
    }

    retornoCaso(datos){
      var toke = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${toke}` 
      });
      const url = `${base_url}/frmSolicitud/Reasignar`;
      return this.http.post( url, { datos }, {headers} );
    }

    
    registrarRemision(datos){      
      const url = `https://apps.personeriabogota.gov.co/sinproc/config/registroRemisionV3.php`;
      return this.http.post( url, { datos });
    }

    registrarActuacion(datos){    
      const url = `https://apps.personeriabogota.gov.co/sinproc/config/registroActuacionV3.php`;
      return this.http.post( url,  datos );
    }

    registrarArchivo(datos){
      const url = `https://apps.personeriabogota.gov.co/sinproc/config/registroArchivoV3.php`;
      return this.http.post( url,  datos );
    }
    
  
}
