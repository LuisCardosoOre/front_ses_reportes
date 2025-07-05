import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hoja, HojaResponse } from '../api/hoja.models';
import { MensajeResponse } from '../api/mensajeResponse.models';
import { ServiceModule } from './service.module';


@Injectable({
  providedIn: ServiceModule
})
export class HojaService {

  private apiServer = `${environment.api_hoja}/hojas`;
  httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
    //.set('authorization', sessionStorage.getItem('token'))
  };

  constructor(private httpClient: HttpClient) { }
/*
  getAll(): Observable<Hoja[]> {
    return this.httpClient.get<HojaResponse>(this.apiServer, this.httpOptions).pipe(
      map((hojaRes: HojaResponse) => {
        return hojaRes.data ?? [];
      })
    );
  }
*/

  getAll(): Observable<Hoja[]> {
    return this.httpClient.get<MensajeResponse<Hoja[]>>(this.apiServer, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<Hoja[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }

  getPeriodoHoja(periodo: string, idTipoHoja: number): Observable<Hoja[]> {
     const url = `${this.apiServer}/consultaHoja`; 
     //const params = new HttpParams().set('periodo', periodo).set('idTipoHoja', idTipoHoja);
    return this.httpClient.get<MensajeResponse<Hoja[]>>(url, this.getHttpOptions({ periodo: periodo, idTipoHoja: idTipoHoja })).pipe(
      map((hojaRes: MensajeResponse<Hoja[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }

  update(id: number, body: Hoja) {
    console.log(id);
    console.log(body);
    return this.httpClient.put(this.apiServer + '/' + id, JSON.stringify(body), this.httpOptions);

  }

  guardar(body: Hoja[]) : Observable<string> {
    console.log(JSON.stringify(body));
    return this.httpClient.post(`${this.apiServer}/guardar`, JSON.stringify(body), this.httpOptions).pipe(
      map((res: MensajeResponse<any>) => {
        return res.mensaje ?? '';
      })
    );
  }

/*
  uploadFile(file: File, periodo: string, idTipoHoja: number) : Observable<string>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('periodo', periodo);
    formData.append('idTipoHoja', idTipoHoja.toString());

    return this.httpClient.post(`${this.apiServer}/cargar-excel`, formData).pipe(
      map((res: MensajeResponse<any>) => {
        return res.mensaje ?? '';
      })
    );
  } 
  */

    uploadFile(formData: FormData) : Observable<string>{
    return this.httpClient.post(`${this.apiServer}/cargar-excel`, formData).pipe(
      map((res: MensajeResponse<any>) => {
        return res.mensaje ?? '';
      })
    );
  } 


  getHttpOptions(params: { [key: string]: any }): { headers: HttpHeaders; params: HttpParams } {
  let httpParams = new HttpParams();

  Object.keys(params).forEach(key => {
    //httpParams = httpParams.set(key, String(params[key])); // Convertimos cualquier valor a string
    httpParams = httpParams.set(key, params[key]);
  });

  return {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
    params: httpParams
  };
}


}
