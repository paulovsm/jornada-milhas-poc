import { Injectable } from '@nestjs/common';
import { Destino } from './destino.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class DestinosService {
  private readonly destinos: Destino[] = [];

  create(destino: Destino): Destino {
    const id = randomUUID();
    const newDestino = { id, ...destino };
    this.destinos.push(newDestino);
    return newDestino;
  }

  findAll(): Destino[] {
    return this.destinos;
  }

  updateDestino(id: string, destino: Destino) {
    const index = this.destinos.findIndex((dest) => dest.id === id);
    if (index !== -1) {
      this.destinos[index] = { id, ...destino };
      return this.destinos[index];
    }
    return null;
  }

  deleteDestino(id: string) {
    const index = this.destinos.findIndex((dest) => dest.id === id);
    if (index !== -1) {
      this.destinos.splice(index, 1);
    }
  }
}
  update(id: number, destino: Destino) {
    this.destinos[id] = destino;
  }

  delete(id: number) {
    this.destinos.splice(id, 1);
  }
}
