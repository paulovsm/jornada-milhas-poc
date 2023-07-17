import { Injectable, NotFoundException } from '@nestjs/common';
import { Depoimento } from './depoimento.interface'
import { randomUUID } from 'crypto';
import { SupabaseClient, createClient } from '@supabase/supabase-js'

@Injectable()
export class DepoimentosService {
    private depoimentos: Depoimento[] = [];
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }

    async getDepoimentos(): Promise<Depoimento[]> {
        const { data, error } = await this.supabase.from('depoimentos').select('*');
        if (error) throw error;
        return data;
    }

    async createDepoimento(depoimento: Depoimento): Promise<Depoimento> {
        const { data, error } = await this.supabase.from('depoimentos').insert([depoimento]);
        if (error) throw error;
        return data[0];
    }

    async updateDepoimento(depoimentoAtualizado: Depoimento): Promise<Depoimento> {
        const { data, error } = await this.supabase
            .from('depoimentos')
            .update(depoimentoAtualizado)
            .match({ id: depoimentoAtualizado.id });
        if (error) throw error;
        return data[0];
    }

    async deleteDepoimento(id: string): Promise<void> {
        const { error } = await this.supabase.from('depoimentos').delete().match({ id });
        if (error) throw error;
    }

    async getRandomDepoimentos(): Promise<Depoimento[]> {
        const { data, error } = await this.supabase.from('depoimentos').select('*');
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

