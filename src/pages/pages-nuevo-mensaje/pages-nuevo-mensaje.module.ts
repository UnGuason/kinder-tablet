import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesNuevoMensajePage } from './pages-nuevo-mensaje';
import { FotoCorreoPipe } from '../../pipes/foto-correo.pipe';
import { NombreCorreoPipe } from '../../pipes/nombre-correo.pipe';

@NgModule({
  declarations: [
    PagesNuevoMensajePage,
  ],
  imports: [
    IonicPageModule.forChild(PagesNuevoMensajePage),FotoCorreoPipe,NombreCorreoPipe
  ],
  exports: [
    PagesNuevoMensajePage
  ]
})
export class PagesNuevoMensajePageModule {}
