import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { CreatePlanSubscriptionDto } from '../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../entities/plan-subscription.entity';
import { InMemoryPlanSubscriptionsDatabaseRepository } from './implementation/in-memory.repository';
import { PrismaMongoDbPlanSubscriptionsDatabaseRepository } from './implementation/prisma-mongodb.repository';
import { PrismaPostgreSqlPlanSubscriptionsDatabaseRepository } from './implementation/prisma-postgresql.repository';

const className = 'PlanSubscriptionsDatabaseRepository';

// Abstraction
export abstract class PlanSubscriptionsDatabaseRepository {
  abstract create(
    createPlanSubscriptionDto: CreatePlanSubscriptionDto
  ): Promise<PlanSubscription>;
  abstract findAll(): Promise<Array<PlanSubscription>>;
  abstract findByEmail(email: string): Promise<PlanSubscription | null>;
}

// Implementation
const isInMemoryDatabaseEnabled =
  featureFlags.inMemoryDatabaseEnabled === 'true';
const useMongoDbInsteadOfPostgreSql =
  featureFlags.useMongoDbInsteadOfPostgreSql === 'true';

export const planSubscriptionsDatabaseRepositoryImplementationFactory = () => {
  if (isInMemoryDatabaseEnabled) {
    Logger.log(
      'Using in-memory plan subscriptions database repository...',
      className
    );
    return InMemoryPlanSubscriptionsDatabaseRepository;
  }

  if (useMongoDbInsteadOfPostgreSql) {
    Logger.log(
      'Using persistent plan subscriptions database repository with MongoDB...',
      className
    );
    return PrismaMongoDbPlanSubscriptionsDatabaseRepository;
  }

  Logger.log(
    'Using persistent plan subscriptions database repository with PostgreSQL...',
    className
  );
  return PrismaPostgreSqlPlanSubscriptionsDatabaseRepository;
};

export const PlanSubscriptionsDatabaseRepositoryImplementation =
  planSubscriptionsDatabaseRepositoryImplementationFactory();
