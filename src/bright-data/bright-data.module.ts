import { Module } from '@nestjs/common';
import { BrightDataService } from './bright-data.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BrightDataService],
  exports: [BrightDataService],
})
export class BrightDataModule {}
