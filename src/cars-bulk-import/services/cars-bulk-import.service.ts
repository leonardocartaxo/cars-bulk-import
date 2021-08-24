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

  // async parseOld(csv: string): Promise<Car[]> {
  // const lines = csv.split('\n');
  // const headerValues = lines[0]?.split(',') ?? [];
  // const dataLines = lines.slice(1, lines.length);
  //
  // const headersMap: { [id: string]: number } = {};
  //
  // for (const name in CarPropertyNames) {
  //   if (isNaN(Number(name))) {
  //     headersMap[name] = headerValues.indexOf(name);
  //   }
  // }
  //
  // const cars = dataLines?.map((line) => {
  //   const values = line.split(',');
  //   const car: Car = {
  //     UUID: values[headersMap[CarPropertyNames.UUID]],
  //     VIN: values[headersMap[CarPropertyNames.VIN]],
  //     Mileage: Number.parseFloat(
  //       values[headersMap[CarPropertyNames.Mileage]],
  //     ),
  //     Make: values[headersMap[CarPropertyNames.Make]],
  //     Create: new Date(values[headersMap[CarPropertyNames.UUID]]),
  //     Price: Number.parseFloat(values[headersMap[CarPropertyNames.UUID]]),
  //     Update: new Date(values[headersMap[CarPropertyNames.UUID]]),
  //     Year: Number.parseFloat(values[headersMap[CarPropertyNames.UUID]]),
  //     ZipCode: values[headersMap[CarPropertyNames.UUID]],
  //     Model: values[headersMap[CarPropertyNames.UUID]],
  //   };
  //
  //   return car;
  // });
  //
  // return cars;

  // const stream = parse<CarCsvInputDto, Car>({ headers: true })
  //   .transform((data, cb): void => {
  //     setImmediate(() =>
  //       cb(null, {
  //         UUID: data.UUID,
  //         VIN: data.VIN,
  //         Year: Number.parseInt(data.Year),
  //         Price: Number.parseFloat(data.Price),
  //         Create: new Date(data['Create Date']),
  //         Update: new Date(data['Update Date']),
  //         Mileage: Number.parseFloat(data.Mileage),
  //         Model: data.Model,
  //         ZipCode: data['Zip Code'],
  //         Make: data.Make,
  //       }),
  //     );
  //   })
  //   .on('error', (error) => console.error(error))
  //   .on('data', (row) => {
  //     console.log(JSON.stringify(row));
  //     cars.push(row);
  //   })
  //   .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
  //
  // stream.write(csvStr);
  // stream.end();
  //
  // return Promise.resolve(cars);

  // const headersDict = headerValues?.map((it, index) => {
  //   switch (it?.trim()?.toLowerCase()) {
  //     case 'uuid':
  //       return { uuid: index };
  //     case 'vin':
  //       return { vin: index };
  //     case 'make':
  //       return { make: index };
  //     case 'Model':
  //       return { Model: index };
  //     case 'Mileage':
  //       return { Mileage: index };
  //     case 'Year':
  //       return { Year: index };
  //     case 'Price':
  //       return { Price: index };
  //     case 'ZipCode':
  //       return { ZipCode: index };
  //     case 'Create':
  //       return { Create: index };
  //     case 'Update':
  //       return { Update: index };
  //   }
  // });

  // headerValues?.forEach((it, index) => {
  //   switch (it?.trim()?.toLowerCase()) {
  //     case CarPropertyNames.UUID.toLowerCase():
  //       headersMap[CarPropertyNames.UUID] = index;
  //       break;
  //     case CarPropertyNames.VIN.toLowerCase():
  //       headersMap[CarPropertyNames.VIN] = index;
  //       break;
  //     case CarPropertyNames.Make.toLowerCase():
  //       headersMap[CarPropertyNames.Make] = index;
  //       break;
  //     case CarPropertyNames.Model.toLowerCase():
  //       headersMap[CarPropertyNames.Model] = index;
  //       break;
  //     case CarPropertyNames.Mileage.toLowerCase():
  //       headersMap[CarPropertyNames.Mileage] = index;
  //       break;
  //     case CarPropertyNames.Year.toLowerCase():
  //       headersMap[CarPropertyNames.Year] = index;
  //       break;
  //     case CarPropertyNames.Price.toLowerCase():
  //       headersMap[CarPropertyNames.Price] = index;
  //       break;
  //     case CarPropertyNames.ZipCode.toLowerCase():
  //       headersMap[CarPropertyNames.ZipCode] = index;
  //       break;
  //     case CarPropertyNames.Create.toLowerCase():
  //       headersMap[CarPropertyNames.Create] = index;
  //       break;
  //     case CarPropertyNames.Update.toLowerCase():
  //       headersMap[CarPropertyNames.Update] = index;
  //       break;
  //   }
  // });
  // }
}
