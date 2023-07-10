import { Module } from '@nestjs/common';
import { DepoimentosModule } from './depoimentos/depoimentos.module';
import { DestinosModule } from './destinos/destinos.module';

@Module({
  imports: [DepoimentosModule, DestinosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
