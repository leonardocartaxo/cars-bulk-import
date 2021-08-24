import { MongoMemoryServer } from 'mongodb-memory-server';
import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { CarsBulkImportModule } from './cars-bulk-import/cars-bulk-import.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule } from './utils/utils.module';

const getMongoUri = async (): Promise<string> => {
  if (process.env.DB_IN_MEMORY === 'true') {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    console.log(`mongo uri: ${uri}`);

    return uri;
  }

  return `mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`;
};

const meta = {
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: await getMongoUri(),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    CarsModule,
    CarsBulkImportModule,
    UtilsModule,
  ],
};
@Module(meta)
export class AppModule {}
