import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
// import {HEROES} from '../mock-heroes';
import { HeroService } from '../hero.service';
// import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // hero: Hero = {
  //   id: 1,
  //   name: "Windstorm"
  // }

  // heroes: Hero[] = HEROES;

  heroes: Hero[];
  // selectedHero: Hero;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }

  getHeroes(): void{
    // this.heroes = this.heroService.getHeroes();
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if(!name) {return;};
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => this.heroes.push(hero));
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(hx => hx !== hero);
    this.heroService.deleteHero(hero).subscribe()
  }
}
