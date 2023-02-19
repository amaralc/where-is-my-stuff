import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from '../../infra/infra.module';
import { UsersModule } from '../users/users.module';
import { PlanSubscriptionsController } from './plan-subscriptions.controller';
import { PlanSubscriptionsService } from './plan-subscriptions.service';
import {
  PlanSubscriptionsDatabaseRepository,
  PlanSubscriptionsDatabaseRepositoryImplementation,
} from './repositories/database/database.repository';
import {
  PlanSubscriptionsEventsRepository,
  PlanSubscriptionsEventsRepositoryImplementation,
} from './repositories/events/events.repository';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
    UsersModule,
  ],
  controllers: [PlanSubscriptionsController],
  providers: [
    PlanSubscriptionsService,
    {
      provide: PlanSubscriptionsDatabaseRepository,
      useClass: PlanSubscriptionsDatabaseRepositoryImplementation,
    },
    {
      provide: PlanSubscriptionsEventsRepository,
      useClass: PlanSubscriptionsEventsRepositoryImplementation,
    },
  ],
})
export class PlanSubscriptionsModule {}