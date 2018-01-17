import { PagesInicioPage } from './../pages-inicio/pages-inicio';
import { Notificaciones } from './../../app/clases/notificaciones';
import { alertMensaje } from './../../app/clases/alertMensaje';
import { RemotoProvider } from './../../providers/remoto/remoto';


import { Infante } from './../../app/clases/infante';
import { BdproviderProvider } from './../../providers/bdprovider/bdprovider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform, ToastController, ModalController } from 'ionic-angular';
import { CONSTANTES } from "../../app/clases/constantes";
import { NotificacionesPage } from "../notificaciones/notificaciones";
import { PagesNuevoMensajePage } from '../pages-nuevo-mensaje/pages-nuevo-mensaje';

/**
 * Generated class for the SalaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sala',
  templateUrl: 'sala.html',
})
export class SalaPage {
  public infantes: Array<Infante>;
  searchQuery: string = '';
  nombre_sala:string="";
  color:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bdprovider: BdproviderProvider, private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform, public remoto:RemotoProvider,
    public toastCtrl:ToastController,
    public modalCtrl: ModalController) {
      let loading = this.loadingCtrl.create({
        content: 'Cargando infantes'     //se muestra el spinner

      });

    let currentDate: string = CONSTANTES.getDate();//fecha actual
    let storageDate: string = localStorage.getItem('fecha');//fecha de la ultima vez que se utilizo la app
    
      if (currentDate != storageDate && this.platform.is('android')) {//si es la primera ejecucion del dia
      console.log('sala');
        loading.present();
        bdprovider.setNotificationsAusente().then(parametro => { 
           //ingresa un nuevo registro ausente por cada  infante
           // y guarda el estado ausente en la variable del localstorage(dni , ausente)

          loading.dismiss();     //cierro el spinner                              
          this.initializeItems();

        }).catch(error => {
          console.error('error en respuesta insertar ausente');
          loading.dismiss();

        })
      } else {
    let aux=  this.initializeItems();
    if(aux){
      loading.dismiss();     //cierro el spinner                              
      
    }else{
      loading.dismiss();     //cierro el spinner                              
      
    }
    
      }
  }
 
  initializeItems():boolean {//  se inicializa el array de infantes desde la base de datos
    this.infantes = new Array<Infante>();
    this.infantes=[];
    this.nombre_sala=localStorage.getItem('nombre_sala');
    this.color=localStorage.getItem('color');
    
    this.bdprovider.traerInfantes().subscribe((_infante) => {

      this.infantes.push(_infante);
      console.log('inicializando',_infante);
      return true;
      

    }, (error) => {
      console.error('error ', error);
      return false
      
    })
    return true;


  }
  getItems(ev: any) {
    // Reset items back to all of the items

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    //   this.infantes = this.infantes.filter((item) => {
    //     return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalaPage');
  }
  
  //enviar notificacion de ingreso | despertar | validar que se retiro de la escuela.
  //todos los infantes al iniciar el diá apreceran como ausentes
  enviarNotificacion(nombre: string, documento: string, estado: string,foto:string) {
    switch (estado) {
      case CONSTANTES.AUSENTE.toString():{
      this.dialogConfirm(nombre, documento,'ingresar');
        break;

      } case CONSTANTES.DESCANSO_INICIO:{
      this.dialogConfirm(nombre, documento,'despertar');
        break;

      }case CONSTANTES.TIPO_SALIDA.toString():{
      this.dialogConfirm(nombre, documento,'retirado');
        break;
      }
    
      default:{
     this.navCtrl.push(NotificacionesPage, {
        nombre: nombre,
        documento:documento,
        foto:foto,
        callback: this.getData
      })
        break;
      }

    }


  }
 //callback de la pagina notificaciones para actualizar el contenido y estado de los infantes
  getData = (data:boolean) => {
    return new Promise((resolve, reject) => {
      this.infantes = [];
      this.bdprovider.traerInfantes().subscribe(data => {
        this.infantes.push(data);
      })
      resolve();
    });
  };
//función q lanza el dialogo para confirmar el ingreso , despertar de siesta o validar que no este retirado
  dialogConfirm(nombre: string, documento: string,estado:string) {
    let msj= new alertMensaje();
    switch (estado) {
      

      case 'ingresar':{
           msj.msj= `Confirma el ingreso de ${nombre} ?`;
           msj.sub= 'Una vez enviada la notificación no se puede cancelar';
        break;
      }
       case 'despertar':{
           msj.msj= `Confirma enviar que ${nombre} desperto de su siesta ?`;
           msj.sub= 'Una vez enviada la notificación no se puede cancelar';
        break;
      }
       case 'retirado':{
            let toast = this.toastCtrl.create({
              message: `${nombre} ya fue retirado, no se pueden enviar notificaciones`,
              duration: 3000,
              position: 'top'
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            return;

            });

            toast.present();

      return;
      }
    
 
    }
    let alert = this.alertCtrl.create({
      title:  msj.msj,
      message:msj.sub,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirma',
          handler: () => {
           
            if ('despertar' ==estado) { //si la notificación a enviar es despertar se crear un nuevo objeto Notificacion
              let fecha=CONSTANTES.getDate();     // y se lo inserta en la BD
              let hora = CONSTANTES.getHora();
              let not= new Notificaciones(documento,CONSTANTES.TIPO_DESCANSO,
                                          CONSTANTES.DESCANSO_FINAL,fecha,hora);
               this.bdprovider.InsertNotificacion(not).then(data=>{
              console.log('data en respuesta ',data);
            })
            } else if ('ingresar' == estado) { //si la notificación a enviar es despertar 
              let fecha=CONSTANTES.getDate();     // y se lo inserta en la BD
              let hora = CONSTANTES.getHora();
              let not= new Notificaciones(documento,CONSTANTES.TIPO_INGRESO,
                CONSTANTES.PRESENTE,fecha,hora);
               this.bdprovider.setPresente(not);//se cambia de ausente a presente el ingreso del infante en la bd


            }
            this.infantes = [];
            this.bdprovider.traerInfantes().subscribe(data => {
              this.infantes.push(data);
            })


          }
        }
      ]
    });
    alert.present();
  }
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  //funcionnn refresh
  doRefresh(refresher) {
    this.bdprovider.refresh2().subscribe(data=>{
      console.log( 'respuesta obs', data);
      refresher.complete();
      
   

    },error=>{
      console.log(error);
      refresher.complete();
      
    },()=>{
      console.log('finally');
      refresher.complete();
      this.initializeItems();
    });

  }

  mensajes(){
    // this.navCtrl.push(PagesNuevoMensajePage);
    let myModal = this.modalCtrl.create(PagesNuevoMensajePage);
    myModal.onDidDismiss(data => {
      console.log(data.cancell);
      let mensaje = data.cancell == 'true' ?'se cancelo el mensaje': 'el mensaje fue enviado';
      let toast = this.toastCtrl.create({
        message: mensaje,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      return;

      });

      toast.present();

    });
    myModal.present()

  }
}
