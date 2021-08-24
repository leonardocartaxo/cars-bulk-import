import { Module } from '@nestjs/common';
import { CarsService } from './services/cars.service';
import { CarsController } from './controllers/cars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }])],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
