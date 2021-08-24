import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CarsModule } from '../src/cars/cars.module';
import { CarsBulkImportModule } from '../src/cars-bulk-import/cars-bulk-import.module';
import { UtilsModule } from '../src/utils/utils.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
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
        CarsBulkImportModule,
        UtilsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) import bulk of cars', () => {
    return request(app.getHttpServer())
      .post('/cars-bulk-import')
      .attach('file', __dirname + '/assets/best cars.csv')
      .expect(HttpStatus.CREATED);
  });
});
