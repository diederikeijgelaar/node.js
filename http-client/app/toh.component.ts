import {Component} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';

import {HeroListComponent} from './hero-list.component';
import {HeroService} from './hero.service';

@Component ({
  selector: 'my-toh',
  template: `
    <h1>Tour of Heroes</h1>
    <hero-list></hero-list>
  `,
  directives:[HeroListComponent],
  providers: [HTTP_PROVIDERS, HeroService]
})
export class TohComponent {

}
