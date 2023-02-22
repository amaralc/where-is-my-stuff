// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaDatabasePostgreSqlService } from '../../../../../infra/database/prisma/implementations/prisma-postgresql.service';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { UsersDatabaseRepository } from '../database.repository';

@Injectable()
export class PrismaPostgreSqlUsersDatabaseRepository
  implements UsersDatabaseRepository
{
  constructor(
    private prismaDatabasePostgreSqlService: PrismaDatabasePostgreSqlService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(
        USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }

    const prismaUser = await this.prismaDatabasePostgreSqlService.users.create({
      data: { email },
    });
    const applicationUser = new User({ email: prismaUser.email });
    return applicationUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser =
      await this.prismaDatabasePostgreSqlService.users.findFirst({
        where: {
          email,
        },
      });
    if (!prismaUser) {
      return null;
    }

    const applicationUser = new User({ email: prismaUser.email });
    return applicationUser;
  }

  async findAll() {
    const prismaUsers =
      await this.prismaDatabasePostgreSqlService.users.findMany();
    const applicationUsers = prismaUsers.map(
      (user) => new User({ email: user.email })
    );
    return applicationUsers;
  }
}
