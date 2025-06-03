import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class CreateUserResponseDto {
	static fromUser(user: User) {
		const response = new CreateUserResponseDto();
		response.authority = user.authority;
		response.username = user.username;
		response.displayName = user.displayName;
		response.email = user.email;
		response.userId = user.userId;
		return response;
	}

	@ApiProperty({
		example: 'localhost',
	})
	authority: string;

	@ApiProperty({
		example: 'johndoe',
	})
	username: string;

	@ApiProperty({
		example: 'John Doe',
		required: false,
	})
	displayName?: string;

	@ApiProperty({
		example: 'johndoe@example.com',
	})
	email: string;

	@ApiProperty({
		example: 'acct:johndoe@localhost',
	})
	userId: string;
}
