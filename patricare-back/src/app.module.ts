import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { DocumentModule } from './modules/document/document.module';
import { AlertModule } from './modules/alert/alert.module';
import { LodgingModule } from './modules/lodging/lodging.module';
import { AddressModule } from './modules/address/address.module';
import { CityModule } from './modules/city/city.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    DocumentModule,
    AlertModule,
    LodgingModule,
    AddressModule,
    CityModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
