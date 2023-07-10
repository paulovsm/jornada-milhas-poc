import { Injectable } from '@nestjs/common';
import { Destino } from './destino.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DestinosService {
  private readonly destinos: Destino[] = [];

  create(destino: Destino): Destino {
    const id = uuidv4();
    const newDestino = { id, ...destino };
    this.destinos.push(newDestino);
    return newDestino;
  }

  findAll(): Destino[] {
    return this.destinos;
  }
}
  update(id: number, destino: Destino) {
    this.destinos[id] = destino;
  }

  delete(id: number) {
    this.destinos.splice(id, 1);
  }
}
