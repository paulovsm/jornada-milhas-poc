import { Injectable, NotFoundException } from '@nestjs/common';
import { Destino } from './destino.interface';
import { randomUUID } from 'crypto';
import { OpenAIApi, Configuration } from 'openai';

@Injectable()
export class DestinosService {
  private readonly destinos: Destino[] = [];
  private openaiConfig: Configuration;
  private openai: OpenAIApi;

  constructor() {
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