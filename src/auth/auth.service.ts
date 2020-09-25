import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    let user = await this.usersService.getOneByName(username);
    if (!user) return false;

    const match = await bcrypt.compare(password, user.hash);
    return match;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const { hash, ...payload } = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
