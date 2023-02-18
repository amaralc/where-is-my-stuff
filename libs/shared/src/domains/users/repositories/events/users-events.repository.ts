import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { User } from '../../entities/user.entity';
import { InMemoryUsersEventsRepository } from './implementation/in-memory-users-events.repository';
import { KafkaUsersEventsRepository } from './implementation/kafka-users-events.repository';

// Abstraction
export abstract class UsersEventsRepository {
  abstract publishUserCreated(user: User): Promise<void>;
}

// Implementation
const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';
export const UsersEventsRepositoryImplementation = isInMemoryEventsEnabled
  ? InMemoryUsersEventsRepository
  : KafkaUsersEventsRepository;

Logger.log(
  isInMemoryEventsEnabled
    ? 'Using in memory events...'
    : 'Using persistent events...'
);