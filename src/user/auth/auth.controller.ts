import { UserType } from '.prisma/client';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { emitWarning } from 'process';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiParam({
    name: "userType",
    enum: ['BUYER', 'REALTOR', 'ADMIN'],
    description:"Different types of users like Buyer, Realtor, Admin can sigin"
  })
  @ApiOperation({
    summary:"signup new type of users"
  })
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        console.log("NO key")
        throw new UnauthorizedException();
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY}`;
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      if (!isValidProductKey) {
        console.log(false);
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body, userType);
  }

  @ApiOperation({
    summary: "User Signin process",
    description:"This route allows buyer or realtor of admin to signin"
  })
  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @ApiOperation({
    summary:"Generate Product Key for all users"
  })
  @Post('/key')
  generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:"Get information about current user"
  })
  @Get('/me')
  me(@User() user: UserInfo) {
    console.log(user);
    return user;
  }
}
