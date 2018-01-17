import { Component } from '@angular/core';

import { SalaPage } from "../sala/sala";
import { MensajesPage } from "../mensajes/mensajes";



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SalaPage;
  tab2Root = MensajesPage;

  constructor() {

  }
  public  handleUserUpdated(event){
    console.log( 'padre',event);
  }}
