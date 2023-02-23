import { TaxonomyModule } from '@auth/shared/domains/taxonomy/taxonomy.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    TaxonomyModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
