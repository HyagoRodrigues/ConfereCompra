import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './entities/receipt.entity';
import { ReceiptItem } from './entities/receipt-item.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private receiptsRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemsRepository: Repository<ReceiptItem>,
  ) {}

  async create(userId: string, createReceiptDto: CreateReceiptDto): Promise<Receipt> {
    const receipt = this.receiptsRepository.create({
      userId,
      storeId: createReceiptDto.storeId,
      accessKey: createReceiptDto.accessKey,
      issueDate: createReceiptDto.issueDate,
      totalAmount: createReceiptDto.totalAmount,
    });

    const savedReceipt = await this.receiptsRepository.save(receipt);

    const items = createReceiptDto.items.map(item => 
      this.receiptItemsRepository.create({
        receiptId: savedReceipt.id,
        ...item
      })
    );

    await this.receiptItemsRepository.save(items);

    return this.findOne(savedReceipt.id);
  }

  async findAll(userId: string): Promise<Receipt[]> {
    return await this.receiptsRepository.find({
      where: { userId },
      relations: ['store', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Receipt> {
    return await this.receiptsRepository.findOne({
      where: { id },
      relations: ['store', 'items', 'items.product'],
    });
  }

  async updateItemStatus(itemId: string, checked: boolean): Promise<ReceiptItem> {
    await this.receiptItemsRepository.update(itemId, { checked });
    return this.receiptItemsRepository.findOne({
      where: { id: itemId },
      relations: ['product'],
    });
  }
}