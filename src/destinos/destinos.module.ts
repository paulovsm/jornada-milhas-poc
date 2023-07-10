import { Module } from '@nestjs/common';
import { DestinosController } from './destinos.controller';
import { DestinosService } from './destinos.service';

@Module({
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
