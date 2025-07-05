import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MensajeResponse } from '../api/mensajeResponse.models';
import { ServiceModule } from './service.module';
import { ProduccionCE } from '../api/ceproduccion.models';
import { Red } from '../api/centros.models';
import { Agrupador, Especialidad, Variable } from '../api/filtros.models';
import { DiagnosticoOriginal } from '../api/cediagnostico.models';
import { HomologadaCE } from '../api/cehomologada.models';


@Injectable({
  providedIn: ServiceModule
})
export class ProduccionCeService {

  private apiServer = `${environment.api_cep}/api`;
  httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
    //.set('authorization', sessionStorage.getItem('token'))
  };

  constructor(private httpClient: HttpClient) { }

  getAllProduccion(): Observable<ProduccionCE[]> {
  return this.httpClient.get<MensajeResponse<ProduccionCE[]>>(`${this.apiServer}/ce_produccion`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<ProduccionCE[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  

  getAllDiagnostico(): Observable<DiagnosticoOriginal[]> {
  return this.httpClient.get<MensajeResponse<DiagnosticoOriginal[]>>(`${this.apiServer}/ce_diagnostico`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<DiagnosticoOriginal[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  

  getAllHomologada(): Observable<HomologadaCE[]> {
    return this.httpClient.get<MensajeResponse<HomologadaCE[]>>(`${this.apiServer}/ce_homologada`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<HomologadaCE[]>) => {
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

  getAgrupador(): Observable<Agrupador[]> {
  return this.httpClient.get<MensajeResponse<Agrupador[]>>(`${this.apiServer}/filtros_cs/agrupador`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<Agrupador[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }  
  
  getVariable(): Observable<Variable[]> {
  return this.httpClient.get<MensajeResponse<Variable[]>>(`${this.apiServer}/filtros_cs/variable`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<Variable[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }
  
  getEspecialidad(): Observable<Especialidad[]> {
  return this.httpClient.get<MensajeResponse<Especialidad[]>>(`${this.apiServer}/filtros_cs/especialidad`, this.httpOptions).pipe(
      map((hojaRes: MensajeResponse<Especialidad[]>) => {
        return hojaRes.data ?? [];
      })
    );
  }      

}
