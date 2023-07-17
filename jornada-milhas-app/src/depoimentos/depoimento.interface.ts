import { IsUUID, IsOptional, IsNotEmpty, IsUrl, Min, MinLength } from 'class-validator';

export class Depoimento {
    @IsOptional()
    id?: string;

    @IsNotEmpty({ message: 'A foto não pode ser vazio' })
    @IsUrl(undefined, { context: { message: 'A foto deve ser uma URL válida' } })
    foto: string;

    @IsNotEmpty({ message: 'O depoimento não pode ser vazio' })
    @MinLength(10, { message: 'O depoimento deve ter no mínimo 10 caracteres' })
    depoimento: string;

    @IsNotEmpty({ message: 'O nome não pode ser vazio' })
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    nome: string;
}