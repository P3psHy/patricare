import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LodgingModule } from './modules/lodging/lodging.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { DocumentModule } from './modules/document/document.module';
import { AddressModule } from './modules/address/address.module';
import { CityModule } from './modules/city/city.module';
import { TypeModule } from './modules/type/type.module';
import { AlertModule } from './modules/alert/alert.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    DocumentModule,
    AlertModule,
    LodgingModule,
    AddressModule,
    CityModule,
    TypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
