import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Generated class for the DeposicionesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'deposiciones',
  templateUrl: 'deposiciones.html'
})
export class DeposicionesComponent {
 @Output() validComponent = new EventEmitter();

  text: string;
  caca:boolean=false;


  constructor() {
    this.text = 'Deposiciones';
  }
validar(tipo:string,cantidad?:string){
if(cantidad){
  this.validComponent.emit({
      valido:true,
      cantidad:cantidad,
      evento:tipo
    });
}else if(tipo==='caca'){
     this.caca=true;
       this.validComponent.emit({
      valido:false,
      cantidad:'0',
      evento:tipo
    });
  
}else{
  this.caca=false;
    this.validComponent.emit({
      valido:true,
      cantidad:'nada',
      evento:tipo
    });
}
}
}
