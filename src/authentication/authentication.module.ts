import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './service/authentication.service';
import { AuthTokensService } from './service/auth-tokens.service';
import { AuthenticationController } from './controller/authentication.controller';
import { UserEntity } from '../entities/user.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_ACCESS_SECRET');
        const expiresIn = config.get<string>('JWT_ACCESS_EXPIRATION');

        if (!secret || !expiresIn) {
          throw new Error('JWT configuration missing in .env');
        }

        return {
          secret,
          signOptions: { expiresIn } as JwtModuleOptions['signOptions'],
        };
      },
    }),
  ],
  providers: [AuthenticationService, AuthTokensService, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [JwtModule, AuthenticationService],
})
export class AuthenticationModule {}
