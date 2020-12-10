import { Injectable } from '@angular/core';
import {Observable, of}from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'; //URL to web api

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /* GET heroes from server */
  getHeroes(): Observable< Hero[]> {
    // TODO: send messages after fetch heroes
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetch heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
        );
  }

  getHero(id: number): Observable<Hero> { //getHero return Observale<Hero> (an Observable of Hero objects)
    const url = `${this.heroesUrl}/${id};`
    // this.messageService.add(`HeroService: fetch hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id));
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET whose name contain serach term */
  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([]) //if not search term, return empty array
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length?
        this.log(`found heroes matching "${term}"`):
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  /**
   * Handle Http operation that failed
   * Let to app continue
   * @param operation - name of operation that failed
   * @param result optial value to return as observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); //log to console insted
      this.log(`${operation} failed: ${error.message}`)   //TODO: better job to transform error for user consumption
      return of(result as T); //let to app keep running by returning empty result
    }
  }

  // updateHero(hero: Hero): Observable<any> {
  //   return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe( //HttpClient have 3 parameter
  //     tap(_ => this.log(`update hero id=${hero.id}`)),
  //     catchError(this.handleError<any>('updateHero'))
  //   )
  // }
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  httpOptions = {
    headers : new HttpHeaders({ 'Content-Type' : 'application/json'})
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`); /* Log a HeroService message with MessageService */
  }

  /* POST: add new hero to server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`add hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  /** Delete Hero from server */
  // deleteHero(hero: Hero | number): Observable<Hero> {
  //   const id = typeof hero === 'number' ? hero: hero.id;
  //   const url = `${this.heroesUrl}/${id}`;

  //   return this.http.delete<Hero>(url, this.httpOptions).pipe( //deleteHero call HttpClient.delete()
  //     tap(_ => this.log(`delete hero id=${hero}`)),
  //     catchError(this.handleError<Hero>('deleteHero'))
  //   )
  // }
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}
