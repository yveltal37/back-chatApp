import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from '../service/authentication.service';
import { CreateUserDto, LoginDto } from '../auth-dtos';


@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {  
    return this.authService.login(loginDto);
  }

}
