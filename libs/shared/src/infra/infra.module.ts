import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaDatabaseMongoDbService } from './database/prisma/implementations/prisma-mongodb.service';
import { PrismaDatabasePostgreSqlService } from './database/prisma/implementations/prisma-postgresql.service';
import {
  EventsService,
  EventsServiceImplementation,
} from './events/events.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [
    PrismaDatabasePostgreSqlService,
    PrismaDatabaseMongoDbService,
    {
      provide: EventsService,
      useClass: EventsServiceImplementation,
    },
  ],
  exports: [
    PrismaDatabasePostgreSqlService,
    PrismaDatabaseMongoDbService,
    {
      provide: EventsService,
      useClass: EventsServiceImplementation,
    },
  ],
})
export class InfraModule {}
