import { Module } from '@nestjs/common';
import { DepoimentosController } from './depoimentos.controller';
import { DepoimentosService } from './depoimentos.service';
import { SupabaseModule } from 'src/lib/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [DepoimentosController],
  providers: [DepoimentosService]
})
export class DepoimentosModule {}
