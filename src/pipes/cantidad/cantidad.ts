import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CantidadPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'cantidad',
})
export class CantidadPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(valor: number):string {


 if(valor==0){
   return 'Nada'

 }else if (valor==111) {
   return 'normal'
 }
 else if (valor == 112){
   return 'blanda'
 }
 else if (valor ==113){
return 'dura';
 }
  else if (valor == 333) {
      return 'Poco';

    } else if (valor > 333 &&  valor < 667  ){
            return 'Normal';

    }
     else if (valor > 800  ){
            return 'Abundante';

    }




  
  }
}
