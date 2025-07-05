import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsultaComponent } from './consulta_externa/consulta/consulta.component';
import { ProduccionComponent } from './consulta_externa/produccion/produccion.component';
import { DiagnosticoComponent } from './consulta_externa/diagnostico/diagnostico.component';
import { HomologadasCeComponent } from './consulta_externa/homologadas-ce/homologadas-ce.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'consulta-medica', component: ConsultaComponent },
    { path: 'produccion', component: ProduccionComponent },
    { path: 'diagnostico', component: DiagnosticoComponent },
    { path: 'homologadas-ce', component: HomologadasCeComponent }
  ])],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
