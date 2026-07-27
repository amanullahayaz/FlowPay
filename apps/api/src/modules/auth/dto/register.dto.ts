import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@flowpay.io', description: 'Unique user email address' })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Plaintext password (min 8 chars)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'Amanullah', description: 'First Name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Ayaz', description: 'Last Name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER, description: 'User System Role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
