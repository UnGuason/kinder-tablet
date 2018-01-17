import { CantidadPipe } from './../../pipes/cantidad/cantidad';
import { DeposicionesComponent } from './../../components/deposiciones/deposiciones';
import { AlimentacionComponent } from './../../components/alimentacion/alimentacion';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacionesPage } from './notificaciones';

@NgModule({
  declarations: [
    NotificacionesPage,AlimentacionComponent,DeposicionesComponent
  ],
  imports: [
    IonicPageModule.forChild(NotificacionesPage),
  ],
  exports: [
    NotificacionesPage
  ],
  providers:[CantidadPipe]
})
export class NotificacionesPageModule {}
