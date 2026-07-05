import {
  Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch,
} from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto/create-budget.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller('budgets')
export class BudgetsController {
  constructor(private service: BudgetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateBudgetDto) {
    return this.service.create(req.user.sub, {
      category: dto.category,
      amount: dto.amount,
    } as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.service.findAllForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('alerts')
  getAlerts(@Request() req: any) {
    return this.service.getAlerts(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.service.findOneForUser(Number(id), req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateBudgetDto) {
    return this.service.update(Number(id), req.user.sub, {
      category: dto.category,
      amount: dto.amount,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.service.remove(Number(id), req.user.sub);
  }
}
