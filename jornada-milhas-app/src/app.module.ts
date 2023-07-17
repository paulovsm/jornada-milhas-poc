import { Module } from '@nestjs/common';
import { DepoimentosModule } from './depoimentos/depoimentos.module';
import { DestinosModule } from './destinos/destinos.module';
import { SupabaseModule } from './lib/supabase.module';
import { Supabase } from './lib/supabaseClient';

@Module({
  imports: [DepoimentosModule, DestinosModule, SupabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
