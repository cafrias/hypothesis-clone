import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from 'zod';

export type UserDocument = HydratedDocument<User>;

const emailSchema = z.string().email();

function isValidEmail(v: string) {
	return emailSchema.safeParse(v).success;
}

export const USER_ID_REGEX =
	/^acct:[A-Za-z0.9_][A-Za-z0-9._]{1,28}[A-Za-z0-9_]@.*$/;

export function isValidUserId(v: string) {
	return USER_ID_REGEX.test(v);
}

const USERNAME_REGEX = /^[A-Za-z0-9._]+$/;

function isValidUsername(v: string) {
	return v.length >= 3 && v.length <= 30 && USERNAME_REGEX.test(v);
}

@Schema()
export class User {
	@Prop({ required: true })
	authority: string;

	@Prop({
		validate: {
			validator: isValidUsername,
			message: 'Username must be between 3 and 30 characters',
		},
		required: true,
	})
	username: string;

	@Prop({
		validate: {
			validator: isValidEmail,
			message: 'Invalid email',
		},
		unique: true,
		required: true,
	})
	email: string;

	@Prop({
		validate: {
			validator: (v: string) => v.length <= 30,
			message: 'Display name must be less than 30 characters',
		},
	})
	displayName?: string;

	@Prop({
		validate: {
			validator: isValidUserId,
			message: 'User ID must be in the format of acct:username',
		},
		unique: true,
		required: true,
	})
	userId: string;

	@Prop({ default: Date.now })
	createdAt: Date;

	@Prop({ default: Date.now })
	updatedAt: Date;

	@Prop({ default: false })
	isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('validate', function (next) {
	if (this.isNew && !this.userId) {
		this.userId = `acct:${this.username}@${this.authority}`;
	}
	next();
});
