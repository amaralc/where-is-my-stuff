import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { ListPaginatedPlanSubscriptionsDto } from '../dto/list-paginated-plan-subscriptions.dto';
import { PlanSubscriptionEntity } from '../entities/plan-subscription/entity';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database.repository';

@Injectable()
export class ListPaginatedPlanSubscriptionsService {
  constructor(private readonly planSubscriptionsRepository: PlanSubscriptionsDatabaseRepository) {}

  async execute(
    listPaginatedPlanSubscriptionsDto: ListPaginatedPlanSubscriptionsDto
  ): Promise<Array<PlanSubscriptionEntity>> {
    await validateOrReject(plainToInstance(ListPaginatedPlanSubscriptionsDto, listPaginatedPlanSubscriptionsDto)).catch(
      (validationErrors: ValidationError[]) => {
        throw new ValidationException(validationErrors, 'Invalid payload');
      }
    );

    return await this.planSubscriptionsRepository.listPaginated(listPaginatedPlanSubscriptionsDto);
  }
}