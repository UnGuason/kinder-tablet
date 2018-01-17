import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesInicioPage } from './pages-inicio';

@NgModule({
  declarations: [
    PagesInicioPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesInicioPage),
  ],
  exports: [
    PagesInicioPage
  ]
})


export class PagesInicioPageModule {


 
}
