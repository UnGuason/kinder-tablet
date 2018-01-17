import { CONSTANTES } from './../../app/clases/constantes';
import { RemotoProvider } from './../../providers/remoto/remoto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ViewController } from 'ionic-angular';

/**
 * Generated class for the PagesNuevoMensajePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pages-nuevo-mensaje',
  templateUrl: 'pages-nuevo-mensaje.html',
})
export class PagesNuevoMensajePage {
  correo:string="";
  destinatarios:any[]=[];
  remitentes_db:any[]=[];
  destino:string;
  destinos:any[]=[];
  asunto:string="";
  mensaje:string="";
  correo_destinatarios:string="";
  


  constructor(public navCtrl: NavController, public navParams: NavParams,   public platform: Platform, 
    public loadingCtrl: LoadingController, private viewCtrl: ViewController,
  private db_remoto:RemotoProvider) {
    this.correo = localStorage.getItem('correo');
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    
        this.db_remoto.buscarDestinatario(this.correo,'2').subscribe(data=>{
          
          

          console.log(data);

          this.remitentes_db.push(...data.directivos);
          this.remitentes_db.push(...data.padres);
          loading.dismiss();
          
        },error=>{
          loading.dismiss();
          
          console.log(error);
        })
  
    // bdprovider.getBD('infantes').subscribe(data=>{
    //   this.infantes=data;
      
    // }) 
    //   bdprovider.getBD('sala').subscribe(data=>{
    //   this.salas=data;
      
    // }) 
    //   bdprovider.getBD('notificaciones').subscribe(data=>{
    //   this.notificaciones=JSON.stringify(data);
      
    // }) 
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesNuevoMensajePage');
  }
  onChange(){
    this.destinos=[];
    
    for(let destinos_posibles of this.remitentes_db){
           for(let correo_seleccionado of this.destino){
             if(destinos_posibles.correo == correo_seleccionado){
               this.destinos.push(destinos_posibles);
             }

           }
      
    }

    console.log(this.destinos);
  }
  onCancell(){
    console.log(this.destino);
    
  }
  enviar(){
    
    console.log('enviar');
    
    
      
      
      let fecha= CONSTANTES.getHora();
  
        
          //si la pestaña es 1 controlo los campos
  
  
        if(this.destinos.length<1 || this.asunto.length<1 || this.mensaje.length <1){
          console.log('sale');
          
          return;
        }
         for( let aux of this.destinos){
           this.correo_destinatarios=this.correo_destinatarios.length<1?aux.correo:this.correo_destinatarios+","+aux.correo;
         }
        
        console.log(this.correo_destinatarios);
        this.db_remoto.nuevoMensaje(this.correo,this.correo_destinatarios,fecha,this.asunto,this.mensaje).subscribe(data=>{
          console.log(data);
          if(!data.error){
            let data = { 'cancell': 'false' };
            this.viewCtrl.dismiss(data);
    
            
  
          }
        },error=>{
          console.log(error);
        })
        return; 
  
    }
    cancel(){
      let data = { 'cancell': 'true' };
      this.viewCtrl.dismiss(data);
    }
}
