import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LodgingController } from './lodging.controler';
import { LodgingService } from './lodging.service';
import { Lodging } from './entities/lodging.entity';
import { Address } from '../address/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lodging, Address])],
  controllers: [LodgingController],
  providers: [LodgingService],
  exports: [LodgingService],
})
export class LodgingModule {}