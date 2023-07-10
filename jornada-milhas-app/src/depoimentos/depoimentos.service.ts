import { Injectable, NotFoundException } from '@nestjs/common';
import { Depoimento } from './depoimento.interface'
import { randomUUID } from 'crypto';

@Injectable()
export class DepoimentosService {
    private depoimentos: Depoimento[] = [];

    getDepoimentos(): Depoimento[] {
        return this.depoimentos;
    }

    createDepoimento(depoimento: Depoimento): Depoimento {
        depoimento.id = randomUUID();
        this.depoimentos.push(depoimento);

        return depoimento;
    }

    updateDepoimento(depoimentoAtualizado: Depoimento): Depoimento {
        const index = this.depoimentos.findIndex((dep) => dep.id === depoimentoAtualizado.id);
        if (index !== -1) {
            this.depoimentos[index] = depoimentoAtualizado;
        } else {
            throw new NotFoundException(`Depoimento com o ID ${depoimentoAtualizado.id} não encontrado`);
        }

        return this.depoimentos[index];
    }

    deleteDepoimento(id: string) {
        // Implementação da lógica do delete
        const index = this.depoimentos.findIndex((dep) => dep.id === id);
        if (index !== -1) {
            this.depoimentos.splice(index, 1);
        } else {
            throw new NotFoundException(`Depoimento com o ID ${id} não encontrado`);
        }

        return {};
    }

    getRandomDepoimentos(): Depoimento[] {
        if (this.depoimentos.length <= 3) {
            return this.depoimentos;
        }

        const depoimentosCopy = [...this.depoimentos];
        const depoimentosAleatorios = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * depoimentosCopy.length);
            depoimentosAleatorios.push(depoimentosCopy[randomIndex]);
            // Remove o depoimento selecionado para não ser selecionado novamente
            depoimentosCopy.splice(randomIndex, 1);
        }

        return depoimentosAleatorios;
    }

}

