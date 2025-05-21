import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { WarrantiesService } from './warranties.service';
import { CreateWarrantyDto, FilterWarrantyDto, UpdateWarrantyDto } from './dto';

@Controller('warranties')
export class WarrantiesController {
  constructor(private readonly warrantiesService: WarrantiesService) {}

  @Post()
  create(@Body() createWarrantyDto: CreateWarrantyDto) {
    return this.warrantiesService.create(createWarrantyDto);
  }

  @Get()
  findAll(@Query() filters: FilterWarrantyDto) {
    return this.warrantiesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warrantiesService.findOne(id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.warrantiesService.findByCode(code);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarrantyDto: UpdateWarrantyDto,
  ) {
    return this.warrantiesService.update(id, updateWarrantyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warrantiesService.remove(id);
  }
}
