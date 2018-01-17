import { Injectable } from '@angular/core';
import { Http,URLSearchParams } from '@angular/http';
import { Notificaciones } from './../../app/clases/notificaciones';
import { Infante } from './../../app/clases/infante';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { BdproviderProvider } from "../bdprovider/bdprovider";

/*
  Generated class for the RemotoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RemotoProvider {

  constructor(public http: Http) {
    console.log('Hello RemotoProvider Provider');
    // this.iniciar();
  }
//   public iniciar():Promise<any> {// lee el web service
// return new Promise<any>((resolve,reject)=>{
//   this.http.get('https://virtualkinder.com/rest/index.php/infantes/listar_sala/15')
//   .map(res => <Infante[]>res.json())
//   .subscribe(data => {
//     for (let item of data) {
//       // this.bdProvider.InsertInfante(item);
//       console.log(data);
      
//         resolve(data);
//     }

//   },error=>{
//     console.log(error);
//   });

// })
   

//   }
public iniciar() {
  
      var link = "https://virtualkinder.com/rest/index.php/infantes/listar_sala/22";
      return this.http.get(link).map(resp => {
        return resp.json();
      });
  
  
 }
 /*
    if (!isset($data['id_infante']) or !isset($data['id_sala']) or !isset($data['fecha'])
          or !isset($data['tipo']) or !isset($data['']))
 */id_notificacion

sendNotifcation(not: Notificaciones):Promise<any> {
  console.log(' not a enviar ',not);
   let datos= new URLSearchParams();
      datos.append('id_sala', '22');
      datos.append('tipo', not.tipo);
      datos.append('id_infante', not.id_infante);
      datos.append('cantidad', not.cantidad);
      datos.append('fecha', not.hora);
      datos.append('id_notificacion', not.id);
       var link = 'https://www.virtualkinder.com/rest/index.php/actividadgon/alta';
  return new Promise((resolve,rejetc)=>{
      // var data = JSON.stringify(not);
       this.http.post(link, datos)
        .map(res => {
          console.log(res);
          let data_resp=res.json();
        console.log('data servidro v kinder',data_resp);

          if(data_resp.error){
                rejetc(data_resp.error);
          }else{
           resolve(data_resp.id)
          }
        })
        .subscribe(dat => {
          console.log('respuesta ser remoto',dat);
        }, error => {
          rejetc(error)
        });


  })


     


       
      

        
       
  }
  buscarDestinatario(correo:string,tipo:string){
    
   let body = new FormData();
   body.append('correo', correo);
   
   var link ="https://virtualkinder.com/rest/index.php/mensajes/buscar_destinatarios/"+tipo;
   let headers = new Headers({
     'Content-Type': 'aplicattion/json'
   });
   return this.http.post  (link, body).map(res => {
     console.log(res);
     return res.json();
   });

  }

  public traer_mensajes (correo:string) {
    
let body = new FormData();
//parametros del infante
body.append('correo', correo);    



var link ="  https://virtualkinder.com/rest/index.php/mensajes/buscar_usuario/";
let headers = new Headers({
'Content-Type': 'aplicattion/json'
});
return this.http.post  (link, body).map(res => {
console.log(res);
return res.json();
});
    
    
}
   //respuesta a un mensaje
   respuestaMensaje(id_dialogo:string,correo_origen:string,correo_destino:string,cuerpo:string,fecha:string){
    let body = new FormData();
      //parametros del infante
      body.append('id_dialogo', id_dialogo);    
      body.append('correo_origen',correo_origen);
      body.append('correo_destino', correo_destino);
      body.append('cuerpo', cuerpo);
      body.append('fecha', fecha);
      
  
      var link ="  https://virtualkinder.com/rest/index.php/mensajes/respuesta/";
      let headers = new Headers({
        'Content-Type': 'aplicattion/json'
      });
      return this.http.post  (link, body).map(res => {
        console.log(res);
        return res.json();
      });
     
     }
     nuevoMensaje(correo_origen:string,correo_destino:string,fecha:string,asunto:string,cuerpo:string){
      // if (!isset($data['correo_origen']) OR !isset($data['fecha'])
      // OR !isset($data['correo_destino']) OR !isset($data['cuerpo'])
      // OR !isset($data['asunto']))
      let body = new FormData();
      //parametros del infante
      body.append('correo_origen', correo_origen);    
      body.append('correo_destino', correo_destino);
      body.append('cuerpo', cuerpo);
      body.append('fecha', fecha);
      body.append('asunto', asunto);
      var link ="  https://virtualkinder.com/rest/index.php/mensajes/alta/";
      let headers = new Headers({
        'Content-Type': 'aplicattion/json'
      });
      return this.http.post  (link, body).map(res => {
        console.log(res);
        return res.json();
      });

    }
  
  
}
