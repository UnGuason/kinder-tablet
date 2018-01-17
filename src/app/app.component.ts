import { RemotoProvider } from './../providers/remoto/remoto';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { CONSTANTES } from "./clases/constantes";
import { PagesInicioPage } from '../pages/pages-inicio/pages-inicio';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private sqlite: SQLite,private _remoto:RemotoProvider) {
    platform.ready().then(() => {
      if(localStorage.getItem('inicio')){
        this.rootPage=TabsPage
      }else{
        this.rootPage=PagesInicioPage
        
      }
      
           
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
  



      
    

 
  
    });
  }
public  handleUserUpdated(event){
    console.log( 'padre',event);
  }
}
