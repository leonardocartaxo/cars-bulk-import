import { Controller, Get } from '@nestjs/common';
import { Car } from '../schemas/car-schema';
import { CarsService } from '../services/cars.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('')
  @ApiOperation({
    summary:
      'List all cars stored. This route was not required. I was added jus for testing',
  })
  @ApiResponse({ type: Car, isArray: true })
  async getAll(): Promise<Car[]> {
    return await this.carsService.getAll();
  }
}
