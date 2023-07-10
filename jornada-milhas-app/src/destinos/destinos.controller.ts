import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { Destino } from './destino.interface';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) { }

  @Post()
  create(@Body() destino: Destino) {
    return this.destinosService.createDestino(destino);
  }

  @Get()
  findAll(@Query('nome') nome: string): Destino[] {
    if (nome) {
      const destinos = this.destinosService.findByName(nome);
      if (destinos.length === 0) {
        return { mensagem: 'Nenhum destino foi encontrado' };
      }
      return destinos;
    }
    return this.destinosService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() destino: Destino) {
    return this.destinosService.updateDestino(id, destino);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
   return this.destinosService.deleteDestino(id);
  }
}
