import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SelectorsDocument = Selectors & Document;

@Schema()
export class Selectors {
  @Prop()
  type: string;

  @Prop()
  csvButton: string;

  @Prop()
  outlookButtonsBar: string;

  @Prop()
  draftSavedText: string;

  @Prop()
  ccAndDccDuttons: string;

  @Prop()
  sendAndDiscardButtons: string;

  @Prop()
  csvTableZone: string;

  @Prop()
  variablesTableZone: string;

  @Prop()
  subjectNode: string;

  @Prop()
  bodyNode: string;
}

export const SelectorsSchema = SchemaFactory.createForClass(Selectors);
