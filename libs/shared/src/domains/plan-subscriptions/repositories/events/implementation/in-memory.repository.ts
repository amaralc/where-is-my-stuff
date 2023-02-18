import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from '../../../../../infra/events/events.service';
import { UsersService } from '../../../../users/users.service';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PlanSubscriptionsEventsRepository } from '../events.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../topics';

@Injectable()
export class InMemoryPlanSubscriptionsEventsRepository
  implements PlanSubscriptionsEventsRepository
{
  constructor(
    private eventsService: EventsService,
    private usersService: UsersService
  ) {}

  async consumePlanSubscriptionCreatedAndUpdateUsers(): Promise<void> {
    this.eventsService.subscribe(
      'plan-subscription-created',
      async ({ message }) => {
        try {
          // Business logic
          if (!message.value) {
            return;
          }
          const jsonMessage = JSON.parse(message.value.toString());
          console.log('message consumed', jsonMessage);
          await this.usersService.create({ email: jsonMessage.email });
        } catch (e) {
          Logger.log(e);
        }
      }
    );
  }

  async publishPlanSubscriptionCreated(
    planSubscription: PlanSubscription
  ): Promise<void> {
    try {
      this.eventsService.publish({
        topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
        messages: [
          {
            key: planSubscription.email,
            value: JSON.stringify({
              email: planSubscription.email,
              id: planSubscription.id,
            }),
          },
        ],
      });
    } catch (e) {
      Logger.log(e);
    }
  }
}
