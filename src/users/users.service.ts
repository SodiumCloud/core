import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async getAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getOneById(id: string): Promise<User> {
    return this.userRepo.findOne({ id });
  }

  async getOneByName(username: string): Promise<User> {
    return this.userRepo.findOne({ username });
  }

  async insertOne(user: RegisterUserDto): Promise<User> {
    const newUser = this.userRepo.create(user);
    await this.userRepo.save(newUser);
    return newUser;
  }

  async updateOne(user: UpdateUserDto): Promise<User> {
    let { username } = user;
    this.userRepo.update({ username }, user);
    return this.getOneById(username);
  }

  async deleteOne(username: string): Promise<DeleteUserDto> {
    try {
      await this.userRepo.delete({ username });
      return { deleted: true, username, message: 'deleted successfully' };
    } catch (err) {
      return { deleted: false, message: err.message, username };
    }
  }
}
