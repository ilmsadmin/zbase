import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { ReportTemplatesService } from './report-templates.service';
import { CreateReportTemplateDto, UpdateReportTemplateDto, QueryReportTemplateDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportType } from '../reports/dto/create-report.dto';

@ApiTags('Report Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('report-templates')
export class ReportTemplatesController {
  constructor(private readonly reportTemplatesService: ReportTemplatesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new report template' })
  @ApiResponse({ status: 201, description: 'The report template has been successfully created.' })
  create(@Body() createReportTemplateDto: CreateReportTemplateDto) {
    return this.reportTemplatesService.create(createReportTemplateDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get all report templates' })
  findAll(@Query() queryDto: QueryReportTemplateDto) {
    return this.reportTemplatesService.findAll(queryDto);
  }

  @Get('by-type/:type')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get report templates by report type' })
  findByType(@Param('type') type: ReportType) {
    return this.reportTemplatesService.findByType(type);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get a report template by ID' })
  findOne(@Param('id') id: string) {
    return this.reportTemplatesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a report template' })
  update(@Param('id') id: string, @Body() updateReportTemplateDto: UpdateReportTemplateDto) {
    return this.reportTemplatesService.update(id, updateReportTemplateDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a report template' })
  remove(@Param('id') id: string) {
    return this.reportTemplatesService.remove(id);
  }

  @Post(':id/set-default')
  @Roles('admin')
  @ApiOperation({ summary: 'Set a template as default for its report type' })
  setDefault(@Param('id') id: string) {
    return this.reportTemplatesService.setDefault(id);
  }
}
