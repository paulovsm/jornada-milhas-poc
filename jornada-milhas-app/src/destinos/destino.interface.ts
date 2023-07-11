import { IsOptional, IsUUID, IsUrl, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class Destino {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsUrl()
  foto: string;

  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @IsNotEmpty()
  @IsNumber()
  preco: number;
}
