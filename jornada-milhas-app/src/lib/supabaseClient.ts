import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class Supabase {
    private readonly logger = new Logger(Supabase.name);
    private clientInstance: SupabaseClient;

    getClient() {
        this.logger.log('getting supabase client...');
        if (this.clientInstance) {
            this.logger.log('client exists');
            return this.clientInstance;
        }

        this.logger.log('initialising new supabase client');

        this.clientInstance = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY
        );

        return this.clientInstance;
    }
}