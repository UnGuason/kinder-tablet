import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreCorreo'
})
export class NombreCorreoPipe implements PipeTransform {

  transform(mensajes:any[], correo: string): string {

    
    
    
          for(let mensaje of mensajes){
            if(mensaje.correo_origen==correo){
              return mensaje.apnom_dest;

            }else{
              return mensaje.apnom_ori;
              
            }
       


  }

}
}
