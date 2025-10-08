import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserDto, LoginDto } from '../auth-dtos'
import bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {}

    async signup(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepo.findOne({ where: { username: createUserDto.username } });
        if (existingUser)
            throw new BadRequestException('User already exists');

        const hashPassword = await bcrypt.hash(createUserDto.password, 10);

        createUserDto.password= hashPassword;
        const user = this.userRepo.create(createUserDto);
        return this.userRepo.save(user);
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

        return user;
    }
}
