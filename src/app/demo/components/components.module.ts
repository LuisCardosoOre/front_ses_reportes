import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from './commons/commons.module';
import { UiModule } from './ui/ui.module';


import { ServiceModule } from '../service/service.module';
import { InterceptorsModule } from '../service/interceptors/interceptors.module';



@NgModule({
  exports: [
    CommonModule,
    CommonsModule,
    UiModule,
    ServiceModule,
    InterceptorsModule
  ],
  declarations: [

  ]
})
export class ComponentsModule { }
