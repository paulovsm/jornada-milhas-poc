import { Injectable, NotFoundException } from '@nestjs/common';
import { Destino } from './destino.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class DestinosService {
  private readonly destinos: Destino[] = [];

  createDestino(destino: Destino): Destino {
    const id = randomUUID();
    const newDestino = { id, ...destino };
    this.destinos.push(newDestino);
    return newDestino;
  }

  findAll(): Destino[] {
    return this.destinos;
  }

  findByName(nome: string): Destino[] {
    return this.destinos.filter(destino => destino.nome.includes(nome));
  }

  findById(id: string): Destino {                                                                                                                                                                 
    const destino = this.destinos.find(dest => dest.id === id);                                                                                                                               
    if (!destino) {                                                                                                                                                                           
      throw new NotFoundException('Destino não encontrado');                                                                                                                                       
    }                                                                                                                                                                                         
    return destino;                                                                                                                                                                           
  } 

  updateDestino(id: string, destino: Destino): Destino {
    const index = this.destinos.findIndex((dest) => dest.id === id);
    if (index !== -1) {
      this.destinos[index] = { id, ...destino };
      return this.destinos[index];
    } else {
      throw new NotFoundException(`Destino com o ID ${id} não encontrado`);
    }
  }

  deleteDestino(id: string) {
    const index = this.destinos.findIndex((dest) => dest.id === id);
    if (index !== -1) {
      this.destinos.splice(index, 1);
    } else {
      throw new NotFoundException(`Destino com o ID ${id} não encontrado`);
    }

    return {};
  }
}