import { Http } from '@angular/http/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalaPage } from './sala';

@NgModule({
  declarations: [
    SalaPage
  ],
  imports: [
    IonicPageModule.forChild(SalaPage)
  ],
  exports: [
    SalaPage
  ]
})
export class SalaPageModule {}
