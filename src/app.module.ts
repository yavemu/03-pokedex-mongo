import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    PokemonModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
