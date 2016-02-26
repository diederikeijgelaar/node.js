import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Response} from 'angular2/http';
import {Hero} from './hero';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HeroService {
  private _heroesUrl = 'http://localhost:3002/hero';

  constructor (private _http: Http) {

  }

  getHeroes () {
    return this._http.get(this._heroesUrl)
      .map(res => <Hero[]> res.json())
      .catch(this.handleError);
  }

  addHero (name: string)   : Observable<Hero> {
    let body = JSON.stringify({ name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this._heroesUrl, body, options)
      .do(res => console.log(res.json()))
      .map(res => <Hero> res.json())
      .catch(this.handleError)
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
