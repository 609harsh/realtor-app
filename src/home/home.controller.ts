import { PropertyType, UserType } from '.prisma/client';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Body,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { HomeService } from './home.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Homes')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  
  @ApiOperation({
    summary:"Get Particular homes ",
    description:'Provide city,minPrice,maxPrice,propertyType to get specific list of homes'
  })
  @ApiQuery({
    name: "city",
    type: 'string',
    description: "City Name",
    example: "Lucknow",        
  })
  @ApiQuery({
    name: "minPrice",
    type: 'string',
    description: 'minimum price for home',
    example:"2000"
  })
  @ApiQuery({
    name: "maxPrice",
    type: 'string',
    description: 'maximum price for home',
    example:"4000"
  })
  @ApiQuery({
    name: "propertyType",
    enum: PropertyType,
    description: 'select Property Type',
  })
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @ApiOperation({
    description: "Get List of all homes",
    summary:"All users can get list of all homes. No authentication needed"
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: "Unique Home Id",
    required: true,
    example:"6cstwazgcsryhre"
  })
  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @ApiBody({
    type:CreateHomeDto
  })
  @ApiBearerAuth()
  @Roles(UserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHomeById(id, body);
  }

  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.getMessagesByHome(id);
  }
}

// 1) Buyer sends message to Realtor
// 2) Realtor gets all messages
