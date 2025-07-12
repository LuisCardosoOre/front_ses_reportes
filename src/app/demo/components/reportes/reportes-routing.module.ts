import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsultaComponent } from './consulta_externa/consulta/consulta.component';
import { ProduccionComponent } from './consulta_externa/produccion/produccion.component';
import { DiagnosticoComponent } from './consulta_externa/diagnostico/diagnostico.component';
import { HomologadasCeComponent } from './consulta_externa/homologadas-ce/homologadas-ce.component';
import { PrioridadesComponent } from './emergencias/prioridades/prioridades.component';
import { HomologadasEmergenciaComponent } from './emergencias/homologadas-emergencia/homologadas-emergencia.component';
import { RepetidasCeComponent } from './consulta_externa/repetidas-ce/repetidas-ce.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'consulta-medica', component: ConsultaComponent },
    { path: 'produccion', component: ProduccionComponent },
    { path: 'diagnostico', component: DiagnosticoComponent },
    { path: 'repetidas', component: RepetidasCeComponent },
    { path: 'homologadas-ce', component: HomologadasCeComponent },
    { path: 'emergencia', component: PrioridadesComponent },
    { path: 'homologadas-emergencia', component: HomologadasEmergenciaComponent }    
  ])],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
