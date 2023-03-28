import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public findAll() {
    return this.usersService.findAll();
  }

  @Post()
  public create(@Body() user: IUser) {
    return this.usersService.create(user);
  }

  @Get(':id/avatar')
  public getAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findAvatar(id);
  }

  @Get(':id')
  public find(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.find(id);
  }

  @Delete(':id/avatar')
  public deleteAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.find(id);
  }
}
