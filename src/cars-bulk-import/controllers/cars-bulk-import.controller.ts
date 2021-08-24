import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ApiFileDecorator } from '../../utils/decorators/api-file-decorator';
import { CarsBulkImportService } from '../services/cars-bulk-import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cars-bulk-import')
export class CarsBulkImportController {
  constructor(private readonly carsBulkImportService: CarsBulkImportService) {}

  @Post('')
  @ApiOperation({
    summary:
      'upload a list of cars in CSV file format with these columns: UUID,VIN,Make,Model,Mileage,Year,Price,Zip Code,Create,Update',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiFileDecorator()
  async upload(@UploadedFile() file: Express.Multer.File): Promise<void> {
    try {
      return await this.carsBulkImportService.save(file);
    } catch (e) {
      throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
