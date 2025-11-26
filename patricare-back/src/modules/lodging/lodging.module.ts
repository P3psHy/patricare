import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LodgingController } from './lodging.controler';
import { LodgingService } from './lodging.service';
import { Lodging } from './entities/lodging.entity';

@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  imports: [TypeOrmModule.forFeature([Lodging])],
  controllers: [LodgingController],
  providers: [LodgingService],
  exports: [LodgingService],
})
export class LodgingModule {}
