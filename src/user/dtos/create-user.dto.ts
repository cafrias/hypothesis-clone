import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'localhost',
	})
	authority: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		format: '^[A-Za-z0-9._]+$',
		example: 'johndoe',
	})
	username: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({
		format: 'email',
		example: 'johndoe@example.com',
	})
	email: string;

	@ApiProperty({
		format: '<= 30 characters',
		example: 'John Doe',
		required: false,
	})
	displayName?: string;
}
