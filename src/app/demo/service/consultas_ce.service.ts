import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MensajeResponse } from '../api/mensajeResponse.models';
import { ServiceModule } from './service.module';
import { ConsultaCE } from '../api/consultace.models';
import { Red } from '../api/centros.models';


@Injectable({
  providedIn: ServiceModule
})
export class ConsultasCeService {

  private apiServer = `${environment.api_cep}/api`;
  httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
    //.set('authorization', sessionStorage.getItem('token'))
  };

  constructor(private httpClient: HttpClient) { }


  getRed(): Observable<Red[]> {
  return this.httpClient.get<MensajeResponse<Red[]>>(`${environment.api}/red`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<Red[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  

  getCentros(): Observable<Red[]> {
  return this.httpClient.get<MensajeResponse<Red[]>>(`${this.apiServer}/filtros_cs/centros`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<Red[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  

  getSES(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}/ce_ses`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }

  getServicios(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}servicios`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }

  getConsultas(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}consultas`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }

  getMedicos(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}medicos`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }
  
  getDesercion(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}desercion`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }
  
  getCitas(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}citas`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  } 
  
  getHoras(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}horas`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  
  
  getProgramadas(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}programada`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  
  
  getTotal(): Observable<ConsultaCE[]> {
  return this.httpClient.get<MensajeResponse<ConsultaCE[]>>(`${this.apiServer}total`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ConsultaCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }    

}
