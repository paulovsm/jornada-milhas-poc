import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DepoimentosService } from './depoimentos.service';
import { Depoimento } from './depoimento.interface';

@Controller('depoimentos')
export class DepoimentosController {
    constructor(private readonly depoimentosService: DepoimentosService) { }

    @Get()
    getDepoimentos() {
        return this.depoimentosService.getDepoimentos();
    }

    @Post()
    createDepoimento(@Body() depoimento: Depoimento) {
        return this.depoimentosService.createDepoimento(depoimento);
    }

    @Put()
    updateDepoimento(@Body() depoimento: Depoimento) {
        return this.depoimentosService.updateDepoimento(depoimento);
    }

    @Delete(':id')
    deleteDepoimento(@Param('id') id: string) {
        return this.depoimentosService.deleteDepoimento(id);
    }

    @Get("home")
    getDepoimentosHome() {
        return this.depoimentosService.getRandomDepoimentos();
    }
}