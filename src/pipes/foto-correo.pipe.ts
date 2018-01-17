import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fotoCorreo'
})
export class FotoCorreoPipe implements PipeTransform {

  transform(conversacion:any, correo: string): string {
    
        
        
        
            if(conversacion.participante1 == correo){
          return    conversacion.foto2
            }else{
              return    conversacion.foto1
              
            }
                  
                
           
    
    
      }
    
    }


