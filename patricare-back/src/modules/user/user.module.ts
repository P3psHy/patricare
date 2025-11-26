import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Lodging } from '../lodging/entities/lodging.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Lodging]),
    // Si tu as des modules spécifiques (LodgingModule / RoleModule) et circular dependencies :
    // forwardRef(() => LodgingModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}