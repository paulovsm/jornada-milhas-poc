import { Injectable } from '@nestjs/common';
import { Destino } from './destino.interface';

@Injectable()
export class DestinosService {
  private readonly destinos: Destino[] = [];

  create(destino: Destino) {
    this.destinos.push(destino);
  }

  findAll(): Destino[] {
    return this.destinos;
  }

  update(id: number, destino: Destino) {
    this.destinos[id] = destino;
  }

  delete(id: number) {
    this.destinos.splice(id, 1);
  }
}
