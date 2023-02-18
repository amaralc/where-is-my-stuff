import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from '../../infra/infra.module';
import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from './repositories/database/users-database.repository';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from './repositories/events/users-events.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersDatabaseRepository,
      useClass: UsersDatabaseRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
  ],
})
export class UsersModule {}