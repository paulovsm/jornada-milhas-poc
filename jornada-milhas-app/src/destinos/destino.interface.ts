import { IsOptional, IsUUID, IsUrl, IsNotEmpty, MinLength, IsNumber, MaxLength } from 'class-validator';

export class Destino {
  @IsOptional()
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  id?: string;

  @IsNotEmpty({ message: 'A foto1 não pode ser vazia' })
  @IsUrl(undefined, { context: { message: 'A foto deve ser uma URL válida' } })
  foto1: string;

  @IsNotEmpty({ message: 'A foto2 não pode ser vazia' })
  @IsUrl(undefined, { context: { message: 'A foto deve ser uma URL válida' } })
  foto2: string;

  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'O preco não pode ser vazio' })
  @IsNumber({}, { message: 'O preco deve ser um número' })
  preco: number;

  @IsNotEmpty({ message: 'A descricao da meta não pode ser vazia' })
  @MaxLength(160, { message: 'A descricao da meta deve ter no máximo 160 caracteres' })
  meta: string;

  @IsOptional()
  textoDescritivo: string;
}
