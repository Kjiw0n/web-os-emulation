import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WindowsModule } from './windows/windows.module';
import { FileSystemModule } from './file-system/file-system.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyscallModule } from './syscall/syscall.module';
import { ProcessesModule } from './processes/processes.module';
import { NotesModule } from './notes/notes.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE'),
        logging: true,
      }),
      inject: [ConfigService],
    }),
    SyscallModule,
    WindowsModule,
    FileSystemModule,
    ProcessesModule,
    NotesModule,
  ],

  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
