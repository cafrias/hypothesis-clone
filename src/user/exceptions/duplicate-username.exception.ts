import { ConflictException } from '@nestjs/common';

export class DuplicateUsernameException extends ConflictException {
  constructor(username: string) {
    super(`Username '${username}' is already taken`);
  }
} 