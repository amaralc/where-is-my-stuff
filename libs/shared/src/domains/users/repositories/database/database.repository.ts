import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { InMemoryUsersDatabaseRepository } from './implementation/in-memory.repository';
import { PrismaMongoDbUsersDatabaseRepository } from './implementation/prisma-mongodb.repository';
import { PrismaPostgreSqlUsersDatabaseRepository } from './implementation/prisma-postgresql.repository';

const className = 'UsersDatabaseRepository';

// Abstraction
export abstract class UsersDatabaseRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
  abstract findByEmail(email: string): Promise<User | null>;
}

// Implementation
const isInMemoryDatabaseEnabled =
  featureFlags.inMemoryDatabaseEnabled === 'true';
const useMongoDbInsteadOfPostgreSql =
  featureFlags.useMongoDbInsteadOfPostgreSql === 'true';

export const usersDatabaseRepositoryImplementationFactory = () => {
  if (isInMemoryDatabaseEnabled) {
    Logger.log(
      'Using in-memory plan subscriptions database repository...',
      className
    );
    return InMemoryUsersDatabaseRepository;
  }

  if (useMongoDbInsteadOfPostgreSql) {
    Logger.log(
      'Using persistent plan subscriptions database repository with MongoDB...',
      className
    );
    return PrismaMongoDbUsersDatabaseRepository;
  }

  Logger.log(
    'Using persistent plan subscriptions database repository with PostgreSQL...',
    className
  );
  return PrismaPostgreSqlUsersDatabaseRepository;
};

export const UsersDatabaseRepositoryImplementation =
  usersDatabaseRepositoryImplementationFactory();
