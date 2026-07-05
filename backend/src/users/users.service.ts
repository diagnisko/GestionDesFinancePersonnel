import { Injectable, NotFoundException } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private repo: Repository<User>;
  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async create(payload: { email: string; password: string; firstname?: string; lastname?: string; role?: string }) {
    const hashed = await bcrypt.hash(payload.password, 12);
    const user = this.repo.create({
      email: payload.email,
      passwordHash: hashed,
      firstname: payload.firstname || null,
      lastname: payload.lastname || null,
      role: (payload.role as any) || 'user'
    } as any);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async findOneById(id: number) {
    const u = await this.repo.findOneBy({ id });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async setRefreshTokenHash(userId: number, hash: string | null) {
    const u = await this.findOneById(userId);
    u.refreshTokenHash = hash;
    return this.repo.save(u);
  }

  async updatePassword(userId: number, newHashedPassword: string) {
    const u = await this.findOneById(userId);
    (u as any).passwordHash = newHashedPassword;
    return this.repo.save(u);
  }

  async update(id: number, payload: Partial<User>) {
    const u = await this.findOneById(id);
    Object.assign(u, payload);
    return this.repo.save(u);
  }

  async remove(id: number) {
    const u = await this.findOneById(id);
    return this.repo.remove(u);
  }
}
