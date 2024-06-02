import { PropertyType } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  address: string;

  @ApiProperty()
  @Exclude()
  number_of_bedrooms: number;

  @ApiProperty()
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @ApiProperty()
  @Exclude()
  number_of_bathrooms: number;

  @ApiProperty()
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  @ApiProperty()
  city: string;

  @ApiProperty()
  @Exclude()
  listed_date: Date;

  @ApiProperty()
  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listedDate;
  }

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  @Exclude()
  land_size: number;

  @ApiProperty()
  @Expose({ name: 'landSize' })
  landSize() {
    return this.landSize;
  }
  propertyType: PropertyType;

  @ApiProperty()
  @Exclude()
  created_at: Date;

  @ApiProperty()
  @Exclude()
  updated_at: Date;

  @ApiProperty()
  @Exclude()
  realtor_id: number;

  constructor(paritial: Partial<HomeResponseDto>) {
    Object.assign(this, paritial);
  }
}

class Image {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  landSize: number;

  @ApiProperty({enum:["RESIDENTIAL","CONDO"]})
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}

export class InquireDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
