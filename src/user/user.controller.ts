import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Post()
	@ApiCreatedResponse({
		description: 'User created',
		type: CreateUserResponseDto,
	})
	@ApiConflictResponse({
		schema: {
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Username `john_doe` is already taken',
				},
			},
		},
		description: 'username, email, or userId are already taken',
	})
	async createUser(
		@Body() createUserDto: CreateUserDto,
	): Promise<CreateUserResponseDto> {
		const user = await this.userService.createUser(createUserDto);
		return CreateUserResponseDto.fromUser(user);
	}
}
