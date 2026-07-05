import {
  Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch,
} from "@nestjs/common";
import { SavingsGoalsService } from "./savings-goals.service";
import { CreateSavingsGoalDto, UpdateSavingsGoalDto } from "./dto/create-savings-goal.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller('savings-goals')
export class SavingsGoalsController {
  constructor(private service: SavingsGoalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateSavingsGoalDto) {
    return this.service.create(req.user.sub, {
      name: dto.name,
      targetAmount: dto.targetAmount,
      currentAmount: dto.currentAmount || 0,
      deadline: dto.deadline || null,
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
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateSavingsGoalDto) {
    return this.service.update(Number(id), req.user.sub, {
      name: dto.name,
      targetAmount: dto.targetAmount,
      currentAmount: dto.currentAmount,
      deadline: dto.deadline,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.service.remove(Number(id), req.user.sub);
  }
}
