import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create({ email: dto.email, password: dto.password, firstname: dto.firstname, lastname: dto.lastname });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.findOneById(req.user.sub);
    return user.toSafeObject();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: any) {
    const updates: any = {};
    if (body.firstname) updates.firstname = body.firstname;
    if (body.lastname) updates.lastname = body.lastname;
    if (body.phone) updates.phone = body.phone;
    if (body.avatar) updates.avatar = body.avatar;
    const user = await this.usersService.update(req.user.sub, updates);
    return user.toSafeObject();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => u.toSafeObject());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(Number(id));
    return user.toSafeObject();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
