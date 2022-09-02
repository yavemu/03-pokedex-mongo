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
import { PaginationDto } from '../common/dto/pagination.dto';

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
      this.handleExceptions(error, 'create');
    }
  }

  findAll(queryParameters: PaginationDto) {
    const { limit = 10, offset = 0 } = queryParameters;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ pokemon_id: 1 })
      .select('-__v');
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
      this.handleExceptions(error, 'update');
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (!deletedCount) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
  }

  private handleExceptions(error: any, action: string) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon with ${JSON.stringify(error.keyValue)} is already created.`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't ${action} Pokemon, undefined Error`,
    );
  }
}
