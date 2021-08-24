import { Injectable } from '@nestjs/common';
import { parseStream } from '@fast-csv/parse';
import { Car } from '../../cars/schemas/car-schema';
import { CarsService } from '../../cars/services/cars.service';
import { Readable } from 'stream';
import { bufferToStream } from '../../utils/helpers/file-utils';

@Injectable()
export class CarsBulkImportService {
  constructor(private readonly carsService: CarsService) {}

  async save(file: Express.Multer.File): Promise<void> {
    const provider = file?.originalname?.split('.csv')?.join('');
    const stream = bufferToStream(file.buffer);

    const cars = await this.csvToCars(stream, provider);

    await this.carsService.saveList(cars);
  }
  async csvToCars(stream: Readable, provider: string): Promise<Car[]> {
    const cars: Car[] = [];

    return new Promise((resolve, reject) => {
      parseStream(stream, { headers: true })
        .on('data', (line) => {
          // here you can attach different parsers to different data providers. something like:
          // switch (provides) {
          //    case 'best cars':
          //      myCustomParser(line)
          //      break;
          //    ...
          //
          cars.push(
            CarsBulkImportService.defaultCsvToCarParser(line, provider),
          );
        })
        .on('error', (error) => reject(error))
        .on('end', () => {
          resolve(cars);
        });
    });
  }

  private static defaultCsvToCarParser(line: any, provider: string): Car {
    return {
      uuid: line.UUID,
      vin: line.VIN,
      year: Number.parseInt(line.Year),
      price: Number.parseFloat(line.Price),
      createdAt: new Date(line['Create Date']),
      updatedAt: new Date(line['Update Date']),
      mileage: Number.parseFloat(line.Mileage),
      model: line.Model,
      zipCode: line['Zip Code'],
      make: line.Make,
      provider: provider,
    };
  }
}
