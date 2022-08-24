import { Injectable } from '@nestjs/common';
import { StripeHelper } from 'src/helpers/stripe/stripe';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper
  ) {}

  async createStripeProtal(customer) {
    const user = await this.userModel.findOne({ email: customer.email }).exec();
    const portalLink = await this._StripeHelper.CreateStripePortal(user.billing.stripe.customerId);

    return portalLink;
  }

  async customerCreated(customer) {
    const data = customer.data.object;
    await this._StripeHelper.CustomerCreated(data);
  }

  async updatePremiumStatus(customer, status?: boolean) {
    if (status) {
      await this.userModel.findOneAndUpdate(
        { email: customer.customer_email },
        {
          billing: {
            paid: status,
            stripe: {
              customerId: customer.customer
            }
          },
        },
      );
    }
  }
}
