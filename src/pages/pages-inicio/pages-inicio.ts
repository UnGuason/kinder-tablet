import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TabsPage } from './../tabs/tabs';
import { Component, EventEmitter, Output } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdproviderProvider } from '../../providers/bdprovider/bdprovider';

/**
 * Generated class for the PagesInicioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pages-inicio',
  templateUrl: 'pages-inicio.html',
})

export class PagesInicioPage {
  slides:any[] = [
    {
      title: "Bienvenido!!!",
      description: "Esta <b>aplicación</b> nos ayudará a comprender muchos temas interesantes en ionic!",
      image: "assets/ica-slidebox-img-1.png",
    },
    {
      title: "¿Qué es ionic?",
      description: "<b>Ionic Framework</b> es un SDK abierto que le permite a los desarrolladores crear aplicaciones móviles de alta calidad con el conocimiento de JavaScript, CSS y HTML.",
      image: "assets/ica-slidebox-img-2.png",
    },
    {
      title: "¿Que hace esta app?",
      description: "Esta aplicación nos ayudará a conocer más sobre el ciclo de vida de un componente y el storage!",
      image: "assets/ica-slidebox-img-3.png",
    }
  ];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private barcodeScanner:BarcodeScanner,dbProvider:BdproviderProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesInicioPage');
  }
  scan(){
    localStorage.setItem('inicio','true');
    this.navCtrl.setRoot(TabsPage);
    // this.barcodeScanner.scan().then((barcodeData) => {
        
    //  }, (err) => {
    //      // An error occurred
    //  });

  
    


  } 
  

}
