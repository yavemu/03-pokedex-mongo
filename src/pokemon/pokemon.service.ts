import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon with ${JSON.stringify(error.keyValue)} is already created.`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `Can't create Pokemon, undefined Error`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(value: string) {
    let condition: object = { name: value };

    if (!Number.isNaN(+value)) {
      condition = { pokemon_id: value };
    } else if (isValidObjectId(value)) {
      condition = { _id: value };
    }

    const pokemon: Pokemon = await this.pokemonModel.findOne(condition);

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with ${JSON.stringify(condition)} not found`,
      );
    }

    return pokemon;
  }

  async update(value: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(value);

      await pokemon.updateOne(updatePokemonDto, { new: true });

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon with ${JSON.stringify(error.keyValue)} is already created.`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `Can't update Pokemon, undefined Error`,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
