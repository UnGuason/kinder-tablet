import { PagesNuevoMensajePage } from './../pages/pages-nuevo-mensaje/pages-nuevo-mensaje';
import { NombreCorreoPipe } from './../pipes/nombre-correo.pipe';
import { FotoCorreoPipe } from './../pipes/foto-correo.pipe';
import { PagesInicioPage } from './../pages/pages-inicio/pages-inicio';
import { CantidadPipe } from './../pipes/cantidad/cantidad';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MensajesPage } from "../pages/mensajes/mensajes";
import { SalaPage } from "../pages/sala/sala";
import { TabsPage } from "../pages/tabs/tabs";
import { NotificacionesPage } from "../pages/notificaciones/notificaciones";
import { AlimentacionComponent } from '../components/alimentacion/alimentacion';
import { DeposicionesComponent } from '../components/deposiciones/deposiciones';
import { BdproviderProvider } from '../providers/bdprovider/bdprovider';
import { Http, HttpModule } from "@angular/http";
import { RemotoProvider } from '../providers/remoto/remoto';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@NgModule({
  declarations: [
    TabsPage,
    MyApp,
    SalaPage,
    MensajesPage,
    NotificacionesPage,
    PagesNuevoMensajePage,
    AlimentacionComponent,
    DeposicionesComponent,
    CantidadPipe,FotoCorreoPipe,NombreCorreoPipe,

    PagesInicioPage
    
  ],
  imports: [HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MensajesPage,
    SalaPage,
    TabsPage,
    NotificacionesPage,
    PagesInicioPage,
    PagesNuevoMensajePage

  ],
  providers: [
      SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BdproviderProvider,
    RemotoProvider,
    CantidadPipe,FotoCorreoPipe,NombreCorreoPipe,
    BarcodeScanner  ]
})
export class AppModule {}
