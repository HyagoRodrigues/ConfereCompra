import { IsString, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateReceiptItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;
}

export class CreateReceiptDto {
  @IsString()
  storeId: string;

  @IsString()
  accessKey: string;

  @IsDateString()
  issueDate: Date;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  items: CreateReceiptItemDto[];
}