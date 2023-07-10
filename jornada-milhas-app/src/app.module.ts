import { Module } from '@nestjs/common';
import { DepoimentosModule } from './depoimentos/depoimentos.module';

@Module({
  imports: [DepoimentosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
