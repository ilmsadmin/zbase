import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, AddCustomerTransactionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  @RequirePermissions('customers.create')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    console.log('BACKEND - Create Customer - Received DTO:', JSON.stringify(createCustomerDto, null, 2));
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @RequirePermissions('customers.read')
  findAll(
    @Query('groupId') groupId?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.customersService.findAll(
      groupId ? parseInt(groupId, 10) : undefined,
      search,
      page,
      limit,
    );
  }

  @Get(':id')
  @RequirePermissions('customers.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }
  @Patch(':id')
  @RequirePermissions('customers.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    console.log('BACKEND - Update Customer - ID:', id);
    console.log('BACKEND - Update Customer - Received DTO:', JSON.stringify(updateCustomerDto, null, 2));
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @RequirePermissions('customers.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }

  @Get(':id/transactions')
  @RequirePermissions('customers.read')
  getCustomerTransactions(
    @Param('id', ParseIntPipe) id: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.customersService.getCustomerTransactions(
      id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      type,
      page,
      limit
    );
  }

  @Post(':id/transactions')
  @RequirePermissions('customers.update')
  addCustomerTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() addTransactionDto: AddCustomerTransactionDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.customersService.addCustomerTransaction(id, userId, addTransactionDto);
  }
}
