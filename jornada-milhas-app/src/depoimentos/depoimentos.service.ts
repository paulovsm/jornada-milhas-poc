import { Injectable, NotFoundException } from '@nestjs/common';
import { Depoimento } from './depoimento.interface'
import { Supabase } from '../lib/supabaseClient';

@Injectable()
export class DepoimentosService {

    constructor(private readonly supabase: Supabase) { }

    async getDepoimentos(): Promise<Depoimento[]> {

        let { data: depoimentos, error } = await this.supabase
            .getClient()
            .from('depoimentos')
            .select('*')

        if (error) throw error;

        return depoimentos;
    }

    async createDepoimento(depoimento: Depoimento): Promise<Depoimento> {
        const { data, error } = await this.supabase.getClient().from('depoimentos').insert([depoimento]).select();
        if (error) throw error;
        if (!data) throw new Error('Failed to create depoimento');
        return data[0];
    }

    async updateDepoimento(depoimentoAtualizado: Depoimento): Promise<Depoimento> {
        const { data, error } = await this.supabase
            .getClient()
            .from('depoimentos')
            .update(depoimentoAtualizado)
            .match({ id: depoimentoAtualizado.id })
            .select();
        if (error) throw error;
        if (!data) throw new Error('Failed to update depoimento');
        return data[0];
    }

    async deleteDepoimento(id: string): Promise<void> {
        const { error } = await this.supabase.getClient().from('depoimentos').delete().match({ id });
        if (error) throw error;
    }

    async getRandomDepoimentos(): Promise<Depoimento[]> {
        const { data, error } = await this.supabase.getClient().from('depoimentos').select('*');
        if (error) throw error;
        if (data.length <= 3) {
            return data;
        }

        const depoimentosAleatorios = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            depoimentosAleatorios.push(data[randomIndex]);
            // Remove o depoimento selecionado para não ser selecionado novamente
            data.splice(randomIndex, 1);
        }

        return depoimentosAleatorios;
    }

}

