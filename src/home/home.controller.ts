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
    summary:"Get All Homes",
    description:'Use Filters to get specific list of homes'
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
    console.log(city)
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

  @ApiOperation({
    summary: "Add New homes",
    description:"REALTOR is allowed to add new homes"
  })
  @ApiBearerAuth()
  @Roles(UserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a home",
    description:"Update a particular or multiple fields of Home. Only Realtor are "
  })
  @ApiParam({
    name: 'id',
    description: "home id",
    example:"6cstwazgcsryhre"
  })
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a home",
    description:"Home can only be deleted by a user of type REALTOR"
  })
  @ApiParam({
    name: 'id',
    description: "home id",
    example:"6cstwazgcsryhre"
  })
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

  @ApiBearerAuth()
  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @ApiBearerAuth()
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
