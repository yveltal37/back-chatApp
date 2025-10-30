import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserDto, LoginDto } from '../auth-dtos';
import bcrypt from 'bcrypt';
import { AuthTokensService } from './auth-tokens.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly authTokensService: AuthTokensService,
    ) {}

    async signup(createUserDto: CreateUserDto) {
        const { username, password, email } = createUserDto;

        if (!username || !email || !password) {
            throw new BadRequestException('Username, email and password are required');
        }

        const existingUser = await this.userRepo.findOne({ where: { username: createUserDto.username } });
        if (existingUser)
            throw new BadRequestException('User already exists');

        const hashPassword = await bcrypt.hash(createUserDto.password, 10);

        createUserDto.password= hashPassword;
        const user = this.userRepo.create(createUserDto);
        const savedUser = await this.userRepo.save(user);

        const tokens = this.authTokensService.generateTokens(savedUser);

        return{
            tokens,
            user: {id: savedUser.id, username: savedUser.username, email: savedUser.email }
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepo.findOne({ where: { username: loginDto.username } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const comparePassword = await bcrypt.compare(loginDto.password, user.password);
        if (!comparePassword) {
            throw new BadRequestException('Invalid password');
        }

        const tokens = this.authTokensService.generateTokens(user);

        return{
            tokens,
            user: {id: user.id, username: user.username, email: user.email }
        };
    }

    async findById(id: number) {
        const user = await this.userRepo.findOne({
            where: { id },
            select: ['id', 'username', 'email']
        });
        return user;
    }

    async refreshTokens(refreshToken: string) {
        try {
            const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
            const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });
            const user = await this.userRepo.findOne({ where: { id: payload.sub } });

            if (!user) throw new BadRequestException('User not found');

            const tokens = this.authTokensService.generateTokens(user);
            return { tokens };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
