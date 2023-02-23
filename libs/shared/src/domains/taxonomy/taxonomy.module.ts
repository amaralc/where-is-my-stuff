import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaxonomyController } from './taxonomy.controller';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
  ],
  controllers: [TaxonomyController],
  providers: [],
  exports: [],
})
export class TaxonomyModule {}
