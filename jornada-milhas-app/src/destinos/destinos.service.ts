import { Injectable, NotFoundException } from '@nestjs/common';
import { Destino } from './destino.interface';
import { randomUUID } from 'crypto';
import { OpenAIApi, Configuration } from 'openai';
import { Supabase } from '../lib/supabaseClient';

@Injectable()
export class DestinosService {
  private openaiConfig: Configuration;
  private openai: OpenAIApi;

  constructor(private readonly supabase: Supabase) {
    this.openaiConfig = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openai = new OpenAIApi(this.openaiConfig);
  }

  async createDestino(destino: Destino): Promise<Destino> {
    const id = randomUUID();
    const newDestino = { id, ...destino };

    if (!destino.textoDescritivo) {
      newDestino.textoDescritivo = await this.generateDescriptiveText(destino.nome);
    }

    const { data, error } = await this.supabase.getClient().from('destinos').insert([newDestino]).select();
    if (error) throw error;
    if (!data) throw new Error('Failed to create destino');
    return data[0];
  }

  async findAll(): Promise<Destino[]> {
    let { data: destinos, error } = await this.supabase
      .getClient()
      .from('destinos')
      .select('*')

    if (error) throw error;

    return destinos;
  }

  async findByName(nome: string): Promise<Destino[]> {
    let { data: destinos, error } = await this.supabase
      .getClient()
      .from('destinos')
      .select('*')
      .ilike('nome', `%${nome}%`);

    if (error) throw error;

    return destinos;
  }

  async findById(id: string): Promise<Destino> {
    let { data: destinos, error } = await this.supabase
      .getClient()
      .from('destinos')
      .select('*')
      .eq('id', id);

    if (error) throw error;
    if (!destinos || destinos.length === 0) throw new NotFoundException('Destino não encontrado');

    return destinos[0];
  }

  async updateDestino(id: string, destino: Destino): Promise<Destino> {
    const { data, error } = await this.supabase
      .getClient()
      .from('destinos')
      .update(destino)
      .match({ id: id })
      .select();

    if (error) throw error;
    if (!data) throw new Error('Failed to update destino');

    return data[0];
  }

  async deleteDestino(id: string): Promise<void> {
    const { error } = await this.supabase.getClient().from('destinos').delete().match({ id });
    if (error) throw error;
  }

  public async generateDescriptiveText(destination: string): Promise<string> {
    let gptResponse;

    try {
      gptResponse = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 1,
        messages: [
          { "role": "system", "content": "You are a helpful assistant." },
          {
            "role": "user", "content": `Write a summary, in brazilian portuguese (pt-Br), about ${destination} emphasizing 
          why this place is amazing. Use informal language and up to 100 characters maximum in each paragraph. 
          Create 2 paragraph in this summary.`}
        ]
        ,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    } catch (error) {
      console.log(error);
      return '';
    }

    return gptResponse.data.choices[0].message;
  }
}