import { Module } from '@nestjs/common';
import { CarsBulkImportService } from './services/cars-bulk-import.service';
import { CarsBulkImportController } from './controllers/cars-bulk-import.controller';
import { CarsModule } from '../cars/cars.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [CarsModule, MulterModule.register()],
  providers: [CarsBulkImportService],
  controllers: [CarsBulkImportController],
})
export class CarsBulkImportModule {}
