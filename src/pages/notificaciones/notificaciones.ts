import { CantidadPipe } from './../../pipes/cantidad/cantidad';
import { alertMensaje } from './../../app/clases/alertMensaje';
import { BdproviderProvider } from './../../providers/bdprovider/bdprovider';
import { Notificaciones } from './../../app/clases/notificaciones';
import { AlimentacionComponent } from './../../components/alimentacion/alimentacion';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CONSTANTES } from "../../app/clases/constantes";

/**
 * Generated class for the NotificacionesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notificaciones',
  templateUrl: 'notificaciones.html',
})
export class NotificacionesPage {
  callback: any;
  private validSend: boolean = false;//valida el boton enviar del formulario de notificaiones
  private PestanaActiva: string = '';
  public texto: string = '';//texto de la notificación especial
  public mostrarNotificaciones:boolean=true;//mostrar o no la seccion notificaciones,dependiendo el ancho
  private nombre:string='';//nombre del infante al que se le van a enviar notificaciones
  private documento:string="";//documento del instante al que se le van a enviar notificaciones
  private foto:string;
  private cantidad:string="";//cantidad es la cantidad de caca , alimentación o texto de la notificacion especial
  private tipo:string='null';//tipo puede ser ingreo,salida , alimtancion, cambio de pañal o descanso
  public tabs;
  
  public notificaciones:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl:AlertController,public bdService:BdproviderProvider,
  public cantidadPipe:CantidadPipe) {
    this.nombre= navParams.get('nombre');              //obtengo los parametros enviados por la otra pagina
    this.documento= navParams.get('documento');
    this.foto= navParams.get('foto');
    
    let witdth: number = window.innerWidth;
    this.bdService.traerNotificaciones(this.documento).subscribe(data => {
      this.notificaciones.push(data);
      console.log(this.notificaciones);
    })
    console.log('width', witdth)
    if (witdth <= 673) {
      this.mostrarNotificaciones = true;
      // this.bdService.traerNotificaciones(this.documento).subscribe(data => {
      //   this.notificaciones.push(data);
      // })
    } else {
      this.mostrarNotificaciones = false;
    }
   this.nombre= navParams.get('nombre');              //obtengo los parametros enviados por la otra pagina
   this.documento= navParams.get('documento');
    this.callback = this.navParams.get('callback');
    console.log(this.documento);

  }


  // funcion  q´recibe parametro de los componentes almuerzo y deposiciones

  obtenerDato(event): void {

    console.log(event.valido, event.evento, event.cantidad);
    this.tipo= event.evento;
    this.cantidad=event.cantidad;
    this.validSend = event.valido;
  }
  //funcion de la notificacion especial , recibe el string ante cada ingreso de caracter
  functionTextoEspecial(texto: string) {
    {
      console.log(texto);
      if (texto.length > 0) {  //si se ingreso algún caracter se muestra el boton de enviar 
        this.validSend = true;
        this.cantidad=texto;   //se asigna el texto a la variable cantidad
      } else {                 // si no hay catacteres se pone en falso(no mostrar)
        this.validSend = false;

      }

    }
  }
  //funcion que se lanza en cada cambio de pestaña de tipo de notificaciones
  // y recibe el  nombre de la pantalla activa
  tab(tab: string) {
    this.validSend = false;//se pone el boton de enviar en falso por si se estaba  mostrando
    this.texto='';//si se cambia de pestaña de notificación y habia texto cargado en la noftificación especial se borra
    switch (tab) {
      case 'descanso': {    //si es descanso se activa el boton anviar
        this.tipo = CONSTANTES.TIPO_DESCANSO;
        this.cantidad=CONSTANTES.DESCANSO_INICIO;
        this.validSend= true;
        break;
      }                         //si es salida se activa el boton enviar notificacion
      case 'salida': {
        this.tipo = CONSTANTES.TIPO_SALIDA;
        this.validSend = true;
        break;
      }
      case 'especial':{
      this.tipo=CONSTANTES.TIPO_ESPECIAL;
      
      }


    }

    this.PestanaActiva = tab;
  }

  // función que se lanza al apretar en el boton enviar notificación
 confirmaNotificacion() {
   let fecha= CONSTANTES.getDate();//fecha que va a tener la notificacion
   let hora=CONSTANTES.getHora();  // hora ""   "   "  


    let not= new Notificaciones(this.documento,this.tipo,this.cantidad,fecha,hora);
 let response:alertMensaje= this.MensajeNotificaion(not,this.nombre);
    let alert = this.alertCtrl.create({
      title: `Confirma el envió  de la notificación?`,
      subTitle:response.sub,
      message: response.msj,
      enableBackdropDismiss:false,
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
            this.bdService.InsertNotificacion(not).then(data=>{
              console.log('data en respuesta ',data);
            })
              this.callback(true).then(()=>{ this.navCtrl.pop() });

          }
        }
      ]
    });
    alert.present();
  }
  //crea el mensaje de de confirmación de acuerdo al tipo de notificación que se selecciona
  MensajeNotificaion(notificacion:Notificaciones,nombre:string):alertMensaje{
    let subtitulo:string=" ";
    let mensaje:string=" ";
               console.log(JSON.stringify(notificacion));

    switch (notificacion.tipo) {
      case CONSTANTES.TIPO_DESAYUNO:{
            subtitulo=`Se enviará una notificación de ${nombre}`;
            mensaje=`Desayunó  notificacion.cantidad`;
          break;
      }case CONSTANTES.TIPO_ALMUERZO:{
           subtitulo=`Se enviará una notificación de que ${nombre}`;
            mensaje=`Almorzó  notificacion.cantidad`;
          break;
      }case CONSTANTES.TIPO_MERIENDA:{
           subtitulo=`Se enviará una notificación de que ${nombre}`;
           
            mensaje=`Merendó  notificacion.cantida`;
          break;
      }case CONSTANTES.TIPO_CACA:{
          subtitulo=`Se enviará una notificación de que a ${nombre}`;
            mensaje=` se le cambio el pañal por caca  ${this.cantidadPipe.transform(parseInt(notificacion.cantidad))}`;
             break;
      }case CONSTANTES.TIPO_PIS:{
          subtitulo=`Se enviará una notificación de que a ${nombre}`;
            mensaje=` se le cambio el pañal por pis`;
      break;
      }case CONSTANTES.TIPO_ESPECIAL:{
             subtitulo=`Se enviará una notificación especial a los responsables de  ${nombre}`;
             mensaje=this.texto;
        break;
      } case CONSTANTES.TIPO_DESCANSO:{
             subtitulo=`Se enviará una notificación de que  ${nombre} se durmió`;
              mensaje='';
        break;
      }case CONSTANTES.TIPO_SALIDA:{
             subtitulo=`Se enviará una notificación de que  ${nombre} se retiro de la institución `;
              mensaje='';
        break;
      }
       default: { 
       subtitulo=`nada`;
        mensaje='nada';
      break; 
   } 
   
  
    }

       let response = new alertMensaje();
       response.msj=mensaje;
       response.sub=subtitulo;
           console.log('response del case',JSON.stringify(response));

       return response
    
    
  }


}