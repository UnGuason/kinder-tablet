import { Directive } from '@angular/core';

/**
 * Generated class for the HideDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[hide]' // Attribute selector
})
export class HideDirective {

  constructor() {
    console.log('Hello HideDirective Directive');
  }

}
