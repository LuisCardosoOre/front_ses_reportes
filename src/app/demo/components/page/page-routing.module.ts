import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsultaExternaComponent } from './consulta-externa/consulta-externa.component';
import { EmergenciaComponent } from './emergencia/emergencia.component';
import { HospitalizacionComponent } from './hospitalizacion/hospitalizacion.component';

@NgModule({
  imports: [RouterModule.forChild([
		{ path: 'consulta-externa', component: ConsultaExternaComponent },
    { path: 'emergencia', component: EmergenciaComponent },
    { path: 'hospitalizacion', component: HospitalizacionComponent }
	])],
  exports: [RouterModule]
})
export class PageRoutingModule { }
