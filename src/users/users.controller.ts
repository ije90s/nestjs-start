import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { AuthGuard } from 'src/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    //@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;
    await this.userService.createUser(name, email, password);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  // private printWinstonLog(dto) {
  //   //console.log(this.logger.data);

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('error: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.userService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.userService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.userService.getUserInfo(userId);
  }
}
