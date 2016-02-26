import {Component} from 'angular2/core';
import {TohComponent} from './toh.component'

@Component ({
  selector: 'my-app',
  template: `
    <h1>Heroes!</h1>
    <my-toh></my-toh>
  `,
  directives: [TohComponent]
})
export class AppComponent {

}
