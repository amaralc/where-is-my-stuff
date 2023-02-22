// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaDatabasePostgreSqlService } from '../../../../../infra/database/prisma/implementations/prisma-postgresql.service';
import { CreatePlanSubscriptionDto } from '../../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '../database.repository';

@Injectable()
export class PrismaPostgreSqlPlanSubscriptionsDatabaseRepository
  implements PlanSubscriptionsDatabaseRepository
{
  constructor(
    private prismaDatabasePostgreSqlService: PrismaDatabasePostgreSqlService
  ) {}

  async create(
    createPlanSubscriptionDto: CreatePlanSubscriptionDto
  ): Promise<PlanSubscription> {
    const { email, plan } = createPlanSubscriptionDto;
    const subscriptionExists = await this.findByEmail(email);
    if (subscriptionExists) {
      throw new ConflictException(
        PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }

    const prismaPlanSubscription =
      await this.prismaDatabasePostgreSqlService.plan_subscriptions.create({
        data: { is_active: true, email, plan },
      });

    const applicationPlanSubscription = new PlanSubscription({
      id: prismaPlanSubscription.id,
      email: prismaPlanSubscription.email,
      plan,
      isActive: prismaPlanSubscription.is_active,
    });
    return applicationPlanSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscription | null> {
    const prismaPlanSubscription =
      await this.prismaDatabasePostgreSqlService.plan_subscriptions.findFirst({
        where: {
          email,
        },
      });
    if (!prismaPlanSubscription) {
      return null;
    }

    const applicationPlanSubscription = new PlanSubscription({
      id: prismaPlanSubscription.id,
      isActive: prismaPlanSubscription.is_active,
      email: prismaPlanSubscription.email,
      plan: prismaPlanSubscription.plan,
    });
    return applicationPlanSubscription;
  }

  async findAll() {
    const prismaPlanSubscriptions =
      await this.prismaDatabasePostgreSqlService.plan_subscriptions.findMany();
    const applicationPlanSubscriptions = prismaPlanSubscriptions.map(
      (subscription) =>
        new PlanSubscription({
          id: subscription.id,
          isActive: subscription.is_active,
          email: subscription.email,
          plan: subscription.plan,
        })
    );
    return applicationPlanSubscriptions;
  }
}
