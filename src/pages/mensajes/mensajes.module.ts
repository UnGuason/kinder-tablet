import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajesPage } from './mensajes';
import { FotoCorreoPipe } from '../../pipes/foto-correo.pipe';
import { NombreCorreoPipe } from '../../pipes/nombre-correo.pipe';


@NgModule({
  declarations: [
    MensajesPage,
  ],
  imports: [
    IonicPageModule.forChild(MensajesPage),FotoCorreoPipe,NombreCorreoPipe
  ],
  exports: [
    MensajesPage
  ]
})
export class MensajesPageModule {}
