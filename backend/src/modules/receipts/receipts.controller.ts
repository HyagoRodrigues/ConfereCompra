import { Controller, Get, Post, Body, Param, Patch, Request } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth()
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  create(@Request() req, @Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptsService.create(req.user.id, createReceiptDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.receiptsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(id);
  }

  @Patch('items/:id/check')
  updateItemStatus(@Param('id') id: string) {
    return this.receiptsService.updateItemStatus(id, true);
  }

  @Patch('items/:id/uncheck')
  removeItemStatus(@Param('id') id: string) {
    return this.receiptsService.updateItemStatus(id, false);
  }
}