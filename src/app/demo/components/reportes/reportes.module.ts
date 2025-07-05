import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ComponentsModule } from '../components.module';
import { ConsultaComponent } from './consulta_externa/consulta/consulta.component';
import { ProduccionComponent } from './consulta_externa/produccion/produccion.component';
import { DiagnosticoComponent } from './consulta_externa/diagnostico/diagnostico.component';
import { HomologadasCeComponent } from './consulta_externa/homologadas-ce/homologadas-ce.component';

@NgModule({
  declarations: [ConsultaComponent,ProduccionComponent, DiagnosticoComponent, HomologadasCeComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ReportesRoutingModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule    
  ]
})
export class ReportesModule { }
