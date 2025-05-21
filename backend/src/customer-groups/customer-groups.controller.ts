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
} from '@nestjs/common';
import { CustomerGroupsService } from './customer-groups.service';
import { CreateCustomerGroupDto, UpdateCustomerGroupDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('customer-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomerGroupsController {
  constructor(private readonly customerGroupsService: CustomerGroupsService) {}

  @Post()
  @RequirePermissions('customer-groups.create')
  create(@Body() createCustomerGroupDto: CreateCustomerGroupDto) {
    return this.customerGroupsService.create(createCustomerGroupDto);
  }

  @Get()
  @RequirePermissions('customer-groups.read')
  findAll(@Query('search') search?: string) {
    return this.customerGroupsService.findAll(search);
  }

  @Get(':id')
  @RequirePermissions('customer-groups.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerGroupsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('customer-groups.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerGroupDto: UpdateCustomerGroupDto,
  ) {
    return this.customerGroupsService.update(id, updateCustomerGroupDto);
  }

  @Delete(':id')
  @RequirePermissions('customer-groups.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerGroupsService.remove(id);
  }
}
