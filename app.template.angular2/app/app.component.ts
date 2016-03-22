import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'my-app',
    template: `
      <h1>{{title}}</h1>
      <nav>
        <a [routerLink]="['Home']" href="#">Home</a>
      </nav>
      <router-outlet></router-outlet>
    `,
    styleUrls: ['app/app.component.css'],
    providers: [ROUTER_PROVIDERS],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig ([
//    {path: '...', name: "Home", component: AppComponent, useAsDefault:true}
])
export class AppComponent {
  public title = "Welcome to Angular2!";
}
