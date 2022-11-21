import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Selectors, SelectorsDocument } from './schemas/selectors.schema';

@Injectable()
export class SelectorsService {
  constructor(
    @InjectModel(Selectors.name)
    private readonly selectorsModel: Model<SelectorsDocument>,
  ) {}

  async GetSelectors() {
    const selectors = await this.selectorsModel.findById('6319e77256db7e5e01e5a826').exec();

    return selectors;
  }
}
