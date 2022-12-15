import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Selectors, SelectorsDocument } from './schemas/selectors.schema';

@Injectable()
export class SelectorsService {
  constructor(
    @InjectModel(Selectors.name)
    private readonly SelectorCollection: Model<SelectorsDocument>,
  ) {}

  async GetSelectors() {
    const selectors = await this.SelectorCollection
      .findById('6319e77256db7e5e01e5a826');

    return selectors;
  }
}
