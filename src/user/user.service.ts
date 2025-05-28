import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { DuplicateUsernameException } from './exceptions/duplicate-username.exception';
import { MongoError } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel({
        ...createUserDto,
        userId: `acct:${createUserDto.username}`,
      });
      await user.save();
      return user;
    } catch (error) {
      // MongoDB duplicate key error code
      if (error instanceof MongoError && error.code === 11000) {
        throw new DuplicateUsernameException(createUserDto.username);
      }
      throw error;
    }
  }
}
