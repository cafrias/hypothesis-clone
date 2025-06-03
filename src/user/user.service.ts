import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { MongoError } from 'mongodb';
import { ConflictException } from '@nestjs/common';

interface MongoErrorWithKeyPattern extends MongoError {
	keyPattern: Record<string, number>;
}

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	/**
	 * Create a new user
	 * @param createUserDto - The user data to create
	 * @returns The created user
	 */
	async createUser(createUserDto: CreateUserDto) {
		try {
			const user = new this.userModel({
				...createUserDto,
			});
			await user.save();
			return user;
		} catch (error) {
			if (error instanceof MongoError && error.code === 11000) {
				const duplicateError = error as MongoErrorWithKeyPattern;
				if (duplicateError.keyPattern.username) {
					throw new ConflictException(
						`Username '${createUserDto.username}' is already taken`,
					);
				} else if (duplicateError.keyPattern.email) {
					throw new ConflictException(
						`Email '${createUserDto.email}' is already registered`,
					);
				} else if (duplicateError.keyPattern.userId) {
					throw new ConflictException('User ID already exists');
				}
			}
			throw error;
		}
	}

	/**
	 * Find a user by their userId
	 * @param userId - The userId of the user to find
	 * @returns The user if found, otherwise null
	 */
	async findByUserId(userId: string) {
		return this.userModel.findOne({ userId });
	}
}
