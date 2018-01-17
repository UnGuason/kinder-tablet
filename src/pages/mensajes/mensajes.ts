import { CONSTANTES } from './../../app/clases/constantes';
import { RemotoProvider } from './../../providers/remoto/remoto';
import { BdproviderProvider } from './../../providers/bdprovider/bdprovider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { PagesNuevoMensajePage } from '../pages-nuevo-mensaje/pages-nuevo-mensaje';

/**
 * Generated class for the MensajesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mensajes',
  templateUrl: 'mensajes.html',
})
export class MensajesPage {
  public infantes:string='';
    public salas:string='';
    public notificaciones:string='';
    public destinatarios:any[]=[];
    public conversaciones:any[]=[];
    public chat:any[]=[];
    public correo:string="";
    id_conversacion:string="";
    respuesta:string="";
    loadingRespuesta:any;
    nombre:string="";
    




  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
      public bdprovider:BdproviderProvider,
      private db_remoto:RemotoProvider,
     public loadingCtrl: LoadingController,
     public  modalCtrl:ModalController,
     public  toastCtrl:ToastController) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.nombre = localStorage.getItem('nombre');
      
       this.correo= localStorage.getItem('correo');
    

    // traer conversaciones
    this.db_remoto.traer_mensajes(this.correo).subscribe(data => {
      console.log(data);
    loading.dismiss();
      
      this.conversaciones = data.mensajes;
      // for(let conversacion of this.conversaciones){
        
             
      //         if(conversacion.id_conversacion === this.id_conversacion){
      //        this.chat= conversacion.mensajes;
              
      //         }
      //       }


    }, error => {
      loading.dismiss();
      
      console.error(error);
    })
   


   


}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MensajesPage');
  }
  ionViewWillEnter	(){
        console.log('ionViewWillEnter MensajesPage');
        this.bdprovider.getBD('infantes').subscribe(data => {
      this.infantes=data;
      
    }) 
         this.bdprovider.getBD('sala').subscribe(data => {
      this.salas=data;
      
    }) 
      this.bdprovider.getBD('notificaciones').subscribe(data => {
      this.notificaciones=JSON.stringify(data);
      
    }) 

  }
   
  seleccionChat(i:number){
    this.id_conversacion= this.conversaciones[i].id_conversacion;
  // this.indice_chat=i;
  this.chat = this.conversaciones[i].mensajes;

}
responderMensaje(){
  if(this.chat.length<1 || this.respuesta.length<1)  {
    console.log('sale');
    return
  }
  let loading = this.loadingCtrl.create({
    content: 'Enviando...'
  });
  loading.present();
  
  let correo_aux:string;
  
    let fecha= CONSTANTES.getHora() ;
    if(this.chat[0].correo_destino !=this.correo){
      correo_aux=this.chat[0].correo_destino ;
      }else{
        correo_aux=this.chat[0].correo_origen;
        
      }
    //si la pestaña es 1 controlo los campos
      // if(this.tab==1){
      //   if(this.id_conversacion.length <1 || this.respuesta.length<1){
      //     this.changeSuccessMessage('error');
      //     return;
      //   }
        
      

    // pestaña conversaciones
    //busco el correo diferente al del usuario logueado
   
    console.log(correo_aux);
    
    
  
        this.db_remoto.respuestaMensaje(this.chat[0].id_dialogo,this.correo,correo_aux,this.respuesta,fecha).subscribe(data=>{
          console.log('respuesta',data);
    
          
          
          if(!data.error){
            
              //si no hay error traigo los mensajes
              this.respuesta="";
              this.db_remoto.traer_mensajes(this.correo).subscribe(data=>{
                console.log(data);
              this.conversaciones=  data.mensajes;
              for(let conversacion of this.conversaciones){
                
                     
                      if(conversacion.id_conversacion === this.id_conversacion){
                     this.chat= conversacion.mensajes;
                      
                      }
                    }

                    
                    loading.dismiss();
                    

            },error=>{
              
              console.error(error);
              loading.dismiss();
              
            })



          }

        },error=>console.log(error))


  }

  mensajes(){
    let myModal = this.modalCtrl.create(PagesNuevoMensajePage);
    myModal.onDidDismiss(data => {
      console.log(data.cancell);
      let mensaje = data.cancell == 'true' ?'se cancelo el mensaje': 'el mensaje fue enviado';
      this.db_remoto.traer_mensajes(this.correo).subscribe(data => {
        console.log(data);
        
        this.conversaciones = data.mensajes;
        
        for(let conversacion of this.conversaciones){
          
               
                if(conversacion.id_conversacion === this.id_conversacion){
               this.chat= conversacion.mensajes;
                
                }
              }
  
        
      }, error => {
        
      })
      let toast = this.toastCtrl.create({
        message: mensaje,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {

       
              return;

      });

      toast.present();

    });
    myModal.present()
      

    

  }

  doRefresh(refresher) {
    console.log('ref');
    this.db_remoto.traer_mensajes(this.correo).subscribe(data => {
      console.log(data);
      if(data.error){
        refresher.complete();
        
        return
      }
      
      this.conversaciones = data.mensajes;
      
      for(let conversacion of this.conversaciones){
        
             
              if(conversacion.id_conversacion === this.id_conversacion){
             this.chat= conversacion.mensajes;
              
              }
            }

      refresher.complete();
      
    }, error => {
      refresher.complete();
      
    })
   

  }


}
