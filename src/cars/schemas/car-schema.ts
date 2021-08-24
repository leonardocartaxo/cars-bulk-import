import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop()
  uuid: string;
  @Prop()
  vin: string;
  @Prop()
  make: string;
  @Prop({ name: 'model' })
  model: string;
  @Prop()
  mileage: number;
  @Prop()
  year: number;
  @Prop()
  price: number;
  @Prop()
  zipCode: string;
  @Prop()
  provider: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);

export enum CarPropertyNames {
  UUID,
  VIN,
  Make,
  Model,
  Mileage,
  Year,
  Price,
  ZipCode,
  Create,
  Update,
}
