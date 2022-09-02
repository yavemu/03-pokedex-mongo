import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokeAPIResponseInstance } from './interfaces/poke-response-api.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/httpAdapter/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter,
  ) {}

  async generatedSeed() {
    const data = await this.httpAdapter.get<PokeAPIResponseInstance>(
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
