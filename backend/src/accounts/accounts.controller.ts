import {
  Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch,
} from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto, UpdateAccountDto } from "./dto/create-account.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller('accounts')
export class AccountsController {
  constructor(private service: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateAccountDto) {
    return this.service.create(req.user.sub, {
      name: dto.name,
      type: dto.type,
      balance: dto.balance || 0,
      currency: dto.currency || 'XOF',
    } as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.service.findAllForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.service.findOneForUser(Number(id), req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.service.update(Number(id), req.user.sub, {
      name: dto.name,
      type: dto.type,
      balance: dto.balance,
      currency: dto.currency,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.service.remove(Number(id), req.user.sub);
  }
}
