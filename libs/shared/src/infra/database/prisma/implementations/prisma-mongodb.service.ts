import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../../../../../../prisma/generated/mongodb';
import { featureFlags } from '../../../../config';

const isInMemoryDatabaseEnabled =
  featureFlags.inMemoryDatabaseEnabled === 'true';

const useMongoDbInsteadOfPostgreSql =
  featureFlags.useMongoDbInsteadOfPostgreSql === 'true';

const skipImplementation =
  !useMongoDbInsteadOfPostgreSql || isInMemoryDatabaseEnabled;

const className = 'PrismaDatabaseMongoDbService';

@Injectable()
export class PrismaDatabaseMongoDbService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    super({
      log: ['query'],
    });
  }

  async onModuleInit() {
    if (skipImplementation) {
      Logger.log('Skipping database connection...', className);
      return;
    }

    Logger.log('Connecting with database...', className);
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    if (skipImplementation) {
      Logger.log('Skipping shudown hook...', className);
      return;
    }

    this.$on('beforeExit', async () => {
      Logger.log('Closing app before database shutdown...', className);
      await app.close();
    });
  }
}
