import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeposicionesComponent } from './deposiciones';

@NgModule({
  declarations: [
    DeposicionesComponent,
  ],
  imports: [
    IonicPageModule.forChild(DeposicionesComponent),
  ],
  exports: [
    DeposicionesComponent
  ]
})
export class DeposicionesComponentModule {}
