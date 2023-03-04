// planSubscriptions.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { pagination } from '../../../config';
import { CreatePlanSubscriptionDto } from '../dto/create-plan-subscription.dto';
import { ListPaginatedPlanSubscriptionsDto } from '../dto/list-paginated-plan-subscriptions.dto';
import { PlanSubscriptionEntity } from '../entities/plan-subscription/entity';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from './database.repository';

@Injectable()
export class InMemoryPlanSubscriptionsDatabaseRepository implements PlanSubscriptionsDatabaseRepository {
  private planSubscriptions: PlanSubscriptionEntity[] = [];

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto): Promise<PlanSubscriptionEntity> {
    const { email, plan } = createPlanSubscriptionDto;
    const isExistingPlanSubscription = await this.findByEmail(email);

    if (isExistingPlanSubscription) {
      throw new ConflictException(PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']);
    }
    const planSubscription = new PlanSubscriptionEntity({ email, plan });
    this.planSubscriptions.push(planSubscription);
    return planSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscriptionEntity | null> {
    return this.planSubscriptions.find((planSubscription) => planSubscription.email === email) || null;
  }

  async listPaginated(listPaginatedPlanSubscriptionsDto: ListPaginatedPlanSubscriptionsDto) {
    const { limit, page } = listPaginatedPlanSubscriptionsDto;
    const localLimit = limit || pagination.defaultLimit;
    const localOffset = page ? page - 1 : pagination.defaultPage - 1;

    const inMemoryPlanSubscriptions = [...this.planSubscriptions].slice(localOffset, localLimit);
    const planSubscriptionEntities = inMemoryPlanSubscriptions.map(
      (inMemoryPlanSubscription) =>
        new PlanSubscriptionEntity({
          ...inMemoryPlanSubscription,
        })
    );
    return planSubscriptionEntities;
  }
}