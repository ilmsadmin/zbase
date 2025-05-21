import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto, UpdateShiftDto, CloseShiftDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('shifts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @RequirePermissions('shifts.create')
  create(@Body() createShiftDto: CreateShiftDto, @GetUser('id') userId: number) {
    return this.shiftsService.create(createShiftDto, userId);
  }

  @Get()
  @RequirePermissions('shifts.read')
  findAll(
    @Query('status') status?: string,
    @Query('warehouseId', new ParseIntPipe({ optional: true })) warehouseId?: number,
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.shiftsService.findAll(status, warehouseId, userId, page, limit);
  }

  @Get('current')
  @RequirePermissions('shifts.read')
  findCurrent(@GetUser('id') userId: number) {
    return this.shiftsService.findCurrentShift(userId);
  }

  @Get(':id')
  @RequirePermissions('shifts.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shiftsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('shifts.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShiftDto: UpdateShiftDto,
  ) {
    return this.shiftsService.update(id, updateShiftDto);
  }

  @Patch(':id/close')
  @RequirePermissions('shifts.update')
  closeShift(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeShiftDto: CloseShiftDto,
    @GetUser('id') userId: number,
  ) {
    return this.shiftsService.closeShift(id, closeShiftDto, userId);
  }

  @Get(':id/summary')
  @RequirePermissions('shifts.read')
  getShiftSummary(@Param('id', ParseIntPipe) id: number) {
    return this.shiftsService.getShiftSummary(id);
  }
}
