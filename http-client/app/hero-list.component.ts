import {Component, OnInit} from 'angular2/core';
import {HeroService} from './hero.service';
import {Hero} from './hero';

@Component ({
  selector: 'hero-list',
  templateUrl: 'app/hero-list.component.html',
  styles: [`.error {color: red}`]
})
export class HeroListComponent implements OnInit{
  private _errorMessage: string;
  heroes: Hero[];

  constructor (
    private _heroService: HeroService) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this._heroService.getHeroes()
      .subscribe(
        heroes => this.heroes = heroes,
        error => this._errorMessage = <any>error);
  }

  getHero(id) {
    this._heroService.getHeroes()
      .subscribe(
        heroes => this.heroes = heroes.filter(hero => hero.id === id),
        error => this._errorMessage = <any>error);
  }

  addHero(name:string) {
    if (!name) {return;}
    console.log("Subscribing to service with: " + name);
    this._heroService.addHero(name)
      .subscribe(
        hero => this.heroes.push(hero),
        error => this._errorMessage = <any>error);
  }
}
