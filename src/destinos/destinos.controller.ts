import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { Destino } from './destino.interface';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Post()
  create(@Body() destino: Destino) {
    this.destinosService.create(destino);
  }

  @Get()
  findAll(): Destino[] {
    return this.destinosService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() destino: Destino) {
    this.destinosService.update(id, destino);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.destinosService.delete(id);
  }
}
