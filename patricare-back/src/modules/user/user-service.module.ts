import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LodgingController } from './user.controler';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { role } from '../role/entities/role.entity';