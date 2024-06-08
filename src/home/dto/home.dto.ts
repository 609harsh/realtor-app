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

  @ApiProperty({required:false})
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @ApiProperty({required:false})
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

  @ApiProperty({required:false})
  @IsNumber()
  @IsPositive()
  landSize: number;

  @ApiProperty({enum:["RESIDENTIAL","CONDO"]})
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({required:false})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  @IsPositive()
  number_of_bedrooms?: number;

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  @IsPositive()
  number_of_bathrooms?: number;

  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @ApiProperty({required:false,enum:PropertyType,examples:[PropertyType.CONDO,PropertyType.RESIDENTIAL]})
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
