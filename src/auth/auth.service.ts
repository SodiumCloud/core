import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    let user = await this.usersService.getOneByName(username);
    if (!user) throw new BadRequestException('User Not Found');

    const match = await bcrypt.compare(password, user.hash);
    return match;
  }
}
