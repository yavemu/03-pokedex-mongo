import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { PokeAPIResponseInstance } from './interfaces/poke-response-api.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async generatedSeed() {
    const { data } = await axios.get<PokeAPIResponseInstance>(
      `https://pokeapi.co/api/v2/pokemon?limit=700`,
    );

    await this.pokemonModel.deleteMany();

    const pokemons: { name: string; pokemon_id: number }[] = [];
    data.results.forEach(async ({ name, url }) => {
      const urlSegments = url.split('/');
      const pokemon_id = +urlSegments[urlSegments.length - 2];

      pokemons.push({ name, pokemon_id });
    });

    await this.pokemonModel.insertMany(pokemons);
    console.log('Pokemon seed generated successfully');
    return 'Seed generated';
  }
}
