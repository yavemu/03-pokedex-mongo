import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  pokemon_id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform((param) => param.value.toLowerCase())
  name: string;
}
