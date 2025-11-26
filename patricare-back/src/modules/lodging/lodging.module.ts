import { Module } from '@nestjs/common';
import { LodgingController } from './lodging.controler';
import { LodgingService } from './lodging.service';

@Module({
  controllers: [LodgingController],
  providers: [LodgingService],
  exports: [LodgingService],
})
export class LodgingModule {}
