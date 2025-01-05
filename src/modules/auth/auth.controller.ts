import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/entities/user.entity';
import { IsPublic, User } from '@src/decorators';
import { LoginDto, LoginResponseDto, UpdatePasswordDto } from './dtos';
import { response } from 'express';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @IsPublic()
  @ApiOkResponse({ type: UserEntity })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @IsPublic()
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Patch('/change-password')
  @ApiOkResponse({ type: UserEntity })
  async changePassword(
    @User() user: UserEntity,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      await this.authService.changePassword(user, updatePasswordDto);
      return response.status(HttpStatus.NO_CONTENT);
    } catch (error) {
      throw error;
    }
  }
}
