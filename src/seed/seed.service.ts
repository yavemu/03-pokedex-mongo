import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeAPIResponseInstance } from './interfaces/poke-response-api.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async generatedSeed() {
    const { data } = await axios.get<PokeAPIResponseInstance>(
      `https://pokeapi.co/api/v2/pokemon?limit=2`,
    );

    data.results.forEach(({ name, url }) => {
      const urlSegments = url.split('/');
      const pokemon_id = +urlSegments[urlSegments.length - 2];
      console.log({ name, pokemon_id });
    });

    return data.results;
  }
}
