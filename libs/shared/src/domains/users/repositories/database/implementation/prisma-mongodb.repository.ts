// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaDatabaseMongoDbService } from '../../../../../infra/database/prisma/implementations/prisma-mongodb.service';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { UsersDatabaseRepository } from '../database.repository';

@Injectable()
export class PrismaMongoDbUsersDatabaseRepository
  implements UsersDatabaseRepository
{
  constructor(
    private prismaDatabaseMongoDbService: PrismaDatabaseMongoDbService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(
        USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }

    console.log(userExists);
    try {
      const prismaUser = await this.prismaDatabaseMongoDbService.users.create({
        data: {
          email: 'email@a.c',
        },
      });
      console.log(prismaUser);
    } catch (e) {
      console.log(e);
    }

    // const prismaUser = await this.prismaDatabaseMongoDbService.users.create({
    //   data: { email },
    // });
    const applicationUser = new User({ email: 'a@e.c' });
    return applicationUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prismaDatabaseMongoDbService.users.findFirst({
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
      await this.prismaDatabaseMongoDbService.users.findMany();
    const applicationUsers = prismaUsers.map(
      (user) => new User({ email: user.email })
    );
    return applicationUsers;
  }
}
