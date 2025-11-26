import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}