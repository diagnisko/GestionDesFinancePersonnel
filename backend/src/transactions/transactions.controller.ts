import {
  Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch, Res,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Response } from "express";

@Controller('transactions')
export class TransactionsController {
  constructor(private ts: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateTransactionDto) {
    return this.ts.create(req.user.sub, {
      description: dto.description,
      amount: dto.amount,
      currency: dto.currency || 'XOF',
      type: dto.type || 'expense',
      category: dto.category || null,
      accountId: dto.accountId,
      user: { id: req.user.sub },
    } as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.ts.findAllForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@Request() req: any) {
    return this.ts.getStats(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export')
  async export(@Request() req: any, @Res() res: Response) {
    const csv = await this.ts.exportCsv(req.user.sub);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.ts.findOneForUser(Number(id), req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: CreateTransactionDto) {
    return this.ts.update(Number(id), req.user.sub, {
      description: dto.description,
      amount: dto.amount,
      currency: dto.currency,
      type: dto.type,
      category: dto.category,
      accountId: dto.accountId,
    } as any);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.ts.remove(Number(id), req.user.sub);
  }
}
