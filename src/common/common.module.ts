import { Module } from '@nestjs/common';
import { AxiosAdapter } from './httpAdapter/axios.adapter';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
