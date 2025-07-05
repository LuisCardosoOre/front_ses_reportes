import { NgModule } from '@angular/core';


import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';



@NgModule({
  exports: [
    TableModule,
    InputTextModule,
    ToastModule,
    DropdownModule,
    ButtonModule,
    FileUploadModule,
    DialogModule,
    SkeletonModule,
    CardModule,
    ChartModule
  ]
})
export class UiModule { }
