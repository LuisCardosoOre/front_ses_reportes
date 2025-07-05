import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TablaEditarComponent } from './tabla-editar/tabla-editar.component';
import { BarraProduccionComponent } from './barra-produccion/barra-produccion.component';

import { UiModule } from '../ui/ui.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';



const COMPONENTS = [
  TablaEditarComponent,
  BarraProduccionComponent,
  FileUploadDialogComponent
];


@NgModule({
  declarations: [...COMPONENTS ],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    UiModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class CommonsModule { }
