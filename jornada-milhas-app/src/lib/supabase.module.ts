import { Module } from '@nestjs/common';
import { Supabase } from './supabaseClient';

@Module({
  providers: [Supabase],
  exports: [Supabase]
})
export class SupabaseModule {}