import { Injectable } from '@nestjs/common';
import { StripeHelper } from 'src/helpers/stripe/stripe';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import Stripe from 'stripe';
import { IStripeHelper } from 'src/helpers/stripe/stripe.interface';
import { IStripeWebhook } from './stripe.interface';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async createStripeProtal(customer: { email: string }) {
    const user = await this.userModel.findOne({ email: customer.email }).exec();
    const portalLink = await this._StripeHelper.CreateStripePortal(
      user.billing.stripe.customerId,
    );

    return portalLink;
  }

  async customerCreated(
    customer: IStripeWebhook.Service.CustomerCreate.Params,
  ) {
    const data = customer.data.object;
    console.log(customer);

    await this._StripeHelper.CustomerCreated(data);
  }

  async updatePremiumStatus(
    body: IStripeWebhook.Service.SubscriptionUpdated.Params,
    status?: boolean,
  ) {
    const customer = body.data.object;

    if (status) {
      await this.userModel.findOneAndUpdate(
        { email: customer.customer_email },
        {
          billing: {
            paid: status,
            stripe: {
              customerId: customer.customer,
            },
          },
        },
      );
    }
  }
}
