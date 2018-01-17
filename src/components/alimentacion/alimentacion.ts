import { Component, Output, EventEmitter } from '@angular/core';
import { CantidadPipe } from './../../pipes/cantidad/cantidad';

/**
 * Generated class for the AlimentacionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'alimentacion',
  templateUrl: 'alimentacion.html'
})
export class AlimentacionComponent {
  @Output() validComponent = new EventEmitter();

  text: string;
  valor:number=0;
  evento:string='';

  constructor(private cantidadPipe:CantidadPipe) {
    this.text = 'Alimentacion';
    this.valor=0;
  
  }

validar(val:string){
    this.valor=0;
    this.evento=val;
    this.validComponent.emit({
      valido:true,
      cantidad:this.cantidadPipe.transform(this.valor),
      evento:this.evento 
    });
  }


rangeChange(){
    this.validComponent.emit({
      valido:true,
      cantidad: this.cantidadPipe.transform(this.valor),
      evento:this.evento 
    });
}
}