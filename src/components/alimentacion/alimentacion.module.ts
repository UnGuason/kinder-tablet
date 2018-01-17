import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlimentacionComponent } from './alimentacion';

@NgModule({
  declarations: [
    AlimentacionComponent,
  ],
  imports: [
    IonicPageModule.forChild(AlimentacionComponent),
  ],
  exports: [
    AlimentacionComponent
  ]
})
export class AlimentacionComponentModule {}
