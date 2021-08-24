import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CarsBulkImportService } from '../src/cars-bulk-import/services/cars-bulk-import.service';
import { CarsModule } from '../src/cars/cars.module';
import { bufferToStream } from '../src/utils/helpers/file-utils';

describe('CarsBulkImportService', () => {
  let service: CarsBulkImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            uri: (await MongoMemoryServer.create()).getUri(),
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
          inject: [ConfigService],
        }),
        CarsModule,
      ],
      providers: [CarsBulkImportService],
    }).compile();

    service = module.get<CarsBulkImportService>(CarsBulkImportService);
  });

  it('parse csv string to cars', async () => {
    const file = await fs.promises.readFile(`test/assets/best cars.csv`);
    const stream = bufferToStream(file);
    const cars = await service.csvToCars(stream, 'test provider.csv');
    expect(cars).toBeTruthy();
  });
});
