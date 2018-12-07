import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  abilitiesURL: string[] = []

  constructor(private _http: HttpClient) { 
    this.getPokemon();
  }
  getPokemon() {
    let squirtle = this._http.get('https://pokeapi.co/api/v2/pokemon/7/')
    squirtle.subscribe(data => {
      let abilitiesD = data['abilities']
      let str: string = data['name'] +"'s abilities are ";
      str = str[0].toUpperCase() + str.substr(1);
      for (var i=0; i<abilitiesD.length; i++) {
        this.abilitiesURL.push(abilitiesD[i]['ability']['url'])
        str += abilitiesD[i]['ability']['name']
        if (i < (abilitiesD.length - 1)) {
          str += " and "
        }
      };
      console.log(str);
      this.getAbilities();
    });
  }

  getAbilities() {
    for (var abilityURL in this.abilitiesURL) {
      let logger: string = "";
      let ability = this._http.get(this.abilitiesURL[abilityURL]);
      ability.subscribe(data => {
        let name: string = data['name'];
        name = name[0].toUpperCase() + name.substr(1);
        let pokemonCrew = data['pokemon']
        let count: number = pokemonCrew.length;
        for (var i=0; i<count; i++) {
          let url = pokemonCrew[i]['pokemon']['url'];
          this.getOtherPokemon(url);
        }
        console.log(count +" pokemon share the "+ name +" ability");
      })
    }
  }

  getOtherPokemon(url) {
    let pokemon = this._http.get(url);
    pokemon.subscribe(data => {
      let name: string = data['name'];
      name = name[0].toUpperCase() + name.substr(1);
      let abilitiesD = data['abilities']
      for (var i=0; i<abilitiesD.length; i++) {
        let thisAbilURL = abilitiesD[i]['ability']['url'];
        if (!this.abilitiesURL.includes(thisAbilURL)) {
          console.log(name +" knows "+ abilitiesD[i]['ability']['name']);
        }
      }
    });
  }
}
