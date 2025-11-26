import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LodgingController } from './lodging.controler';
import { LodgingService } from './lodging.service';
import { Lodging } from './entities/lodging.entity';
import { Adresse } from '../address/entities/adresse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lodging, Adresse])],
  controllers: [LodgingController],
  providers: [LodgingService],
  exports: [LodgingService],
})
export class LodgingModule {}