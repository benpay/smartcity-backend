import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository <User>
    ) {}

    async create (email: string, password: string): Promise<User> {
        const exists = await this.userRepository.findOneBy({ email })
        if (exists) throw new ConflictException('Email ya registrado');

        const passwordHash = await bcrypt.hash(password, 10);
        const savedUser = await this.userRepository.create({ email, passwordHash })

        return this.userRepository.save(savedUser);
    }

    async findUserByEmail (email: string): Promise<User | null> {
        if (email == null) throw new ConflictException('El email no puede estar vacío o ser un valor nulo');

        return this.userRepository.findOneBy({ email });
    }

    async findById(id: string): Promise<User | null> {
        if (id == null) throw new ConflictException('El email no puede estar vacío o ser un valor nulo');
      
        return await this.userRepository.findOneBy({ id });
    }
}