import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../types/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDTO, LoginDTO } from '../auth/auth.dto';

import * as bcrypt from 'bcrypt';
import { Payload } from '../types/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  sanitizeUser(user: User) {
    const { _id, seller, created, username } = user;
    return {
      id: _id,
      seller,
      created,
      username,
    };
  }

  async findAll() {
    return await this.userModel.find();
  }

  async create(userDTO: RegisterDTO) {
    const { username } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByLogin(userDTO: LoginDTO) {
    const { username, password } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: Payload) {
    const { username } = payload;
    return await this.userModel.findOne({ username });
  }
}
