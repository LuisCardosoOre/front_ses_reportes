import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageRoutingModule } from './page-routing.module';
import { ComponentsModule } from '../components.module';
import { ConsultaExternaComponent } from './consulta-externa/consulta-externa.component';
import { EmergenciaComponent } from './emergencia/emergencia.component';
import { HospitalizacionComponent } from './hospitalizacion/hospitalizacion.component';

@NgModule({
  declarations: [ConsultaExternaComponent, EmergenciaComponent, HospitalizacionComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    PageRoutingModule,
    RouterModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class PageModule { }
