import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { User } from '@src/decorators';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOkResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.userService.create(createUserDto);
      return res;
    } catch (error) {
      throw error;
    }
  }

  @Patch('')
  @ApiOkResponse({ type: UserEntity })
  async changePassword(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const res = await this.userService.updateById(user.id, updateUserDto);
      return res;
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserEntity })
  async getById(@Param('id') id: string) {
    try {
      const res = await this.userService.getById(id);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
