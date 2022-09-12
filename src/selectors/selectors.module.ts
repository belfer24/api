import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Selectors, SelectorsSchema } from './schemas/selectors.schema';
import { SelectorsController } from './selectors.controller';
import { SelectorsService } from './selectors.service';

@Module({
  controllers: [SelectorsController],
  providers: [SelectorsService],
  imports: [
    MongooseModule.forFeature([
      { name: Selectors.name, schema: SelectorsSchema }
    ])
  ]
})
export class SelectorsModule {}
