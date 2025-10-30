import { Controller, Post, Body, Header } from '@nestjs/common';
import { AuthenticationService } from '../service/authentication.service';
import { CreateUserDto, LoginDto } from '../auth-dtos';


@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}


  @Post('signup')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async login(@Body() loginDto: LoginDto ) {  
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
