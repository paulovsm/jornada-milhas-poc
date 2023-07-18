import { Module } from '@nestjs/common';
import { DestinosController } from './destinos.controller';
import { DestinosService } from './destinos.service';
import { SupabaseModule } from 'src/lib/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
