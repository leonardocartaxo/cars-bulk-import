import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../schemas/car-schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async getAll(): Promise<Car[]> {
    return this.carModel.find();
  }

  async saveList(cars: Car[]): Promise<Car[]> {
    try {
      return await this.carModel.insertMany(cars);
    } catch (error) {
      if (error?.name === 'MongoError' && error?.code === 11000)
        throw new BadRequestException(error.message);
      else throw error;
    }
  }
}
