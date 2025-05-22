"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  FiDownload, FiSave, FiPlus, FiEdit, FiTrash2,
  FiCheckSquare, FiFilter, FiColumns, FiSettings,
  FiTable, FiHelpCircle, FiClock, FiSearch
} from "react-icons/fi";
import { 
  ReportType, ReportFormat, ReportFrequency,
  ReportTemplate, Report, reportService
} from "@/lib/api/services/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Loading } from "@/components/ui/Loading";
import { formatDateTime, formatDate } from "@/lib/utils/format";
import { DataTable, Column } from "@/components/ui/Table/DataTable";

export default function CustomReportsPage() {
  const t = useTranslations("admin.reports");
  
  // State for report templates
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for template filter
  const [templateFilter, setTemplateFilter] = useState<{
    search: string;
    type: ReportType | '';
  }>({
    search: '',
    type: '',
  });
  
  // State for new/edit report template
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    type: ReportType.CUSTOM,
    defaultFormat: ReportFormat.PDF,
    parameters: {},
    isSystem: false,
  });
  
  // State for generate report dialog
  const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    name: '',
    description: '',
    type: ReportType.CUSTOM,
    format: ReportFormat.PDF,
    frequency: ReportFrequency.ONCE,
    parameters: {},
  });
  
  // State for report parameters (simplified for custom report builder)
  const [reportParameters, setReportParameters] = useState<{
    dateRange: { from: string, to: string };
    entities: string[];
    metrics: string[];
    filters: { field: string, operator: string, value: string }[];
    groupBy: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  }>({
    dateRange: {
      from: new Date().toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    entities: [],
    metrics: [],
    filters: [],
    groupBy: '',
    sortBy: '',
    sortDirection: 'asc'
  });
  
  // Fetch templates
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data } = await reportService.getReportTemplates({
        search: templateFilter.search,
        type: templateFilter.type as ReportType || undefined,
        page: 1,
        limit: 50,
      });
      
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle create/edit template
  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        await reportService.updateReportTemplate(editingTemplate.id, newTemplate);
      } else {
        await reportService.createReportTemplate(newTemplate);
      }
      
      setIsNewTemplateDialogOpen(false);
      setEditingTemplate(null);
      setNewTemplate({
        name: '',
        description: '',
        type: ReportType.CUSTOM,
        defaultFormat: ReportFormat.PDF,
        parameters: {},
        isSystem: false,
      });
      
      fetchTemplates();
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };
  
  // Handle delete template
  const handleDeleteTemplate = async (id: string) => {
    if (confirm(t('confirmDeleteTemplate'))) {
      try {
        await reportService.deleteReportTemplate(id);
        fetchTemplates();
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    }
  };
  
  // Handle edit template
  const handleEditTemplate = (template: ReportTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      type: template.type,
      defaultFormat: template.defaultFormat,
      parameters: template.parameters,
      isSystem: template.isSystem,
    });
    setIsNewTemplateDialogOpen(true);
  };
  
  // Handle generate report
  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;
    
    try {
      // Create the report
      const reportData: Partial<Report> = {
        name: newReport.name,
        description: newReport.description,
        type: selectedTemplate.type,
        format: newReport.format,
        frequency: newReport.frequency,
        parameters: {
          ...selectedTemplate.parameters,
          ...reportParameters
        },
      };
      
      const result = await reportService.createReport(reportData);
      
      if (result && result.id) {
        // Generate the report
        await reportService.generateReport(result.id);
        
        setIsGenerateReportDialogOpen(false);
        setSelectedTemplate(null);
        setNewReport({
          name: '',
          description: '',
          type: ReportType.CUSTOM,
          format: ReportFormat.PDF,
          frequency: ReportFrequency.ONCE,
          parameters: {},
        });
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };
  
  useEffect(() => {
    fetchTemplates();
  }, [templateFilter]);
  
  // Table columns for templates
  const templateColumns: Column<ReportTemplate>[] = [
    {
      key: 'name',
      header: t('templateName'),
      render: (row) => <span>{row.name}</span>,
      sortable: true,
    },
    {
      key: 'description',
      header: t('description'),
      render: (row) => <span>{row.description}</span>,
      sortable: false,
    },
    {
      key: 'type',
      header: t('type'),
      render: (row) => <span>{row.type}</span>,
      sortable: true,
    },
    {
      key: 'defaultFormat',
      header: t('defaultFormat'),
      render: (row) => <span className="uppercase">{row.defaultFormat}</span>,
      sortable: true,
    },
    {
      key: 'createdAt',
      header: t('createdAt'),
      render: (row) => <span>{formatDateTime(row.createdAt)}</span>,
      sortable: true,
    },
    {
      key: 'actions',
      header: t('actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedTemplate(row);
              setNewReport({
                name: `${row.name} - ${formatDate(new Date())}`,
                description: row.description,
                type: row.type,
                format: row.defaultFormat,
                frequency: ReportFrequency.ONCE,
                parameters: row.parameters,
              });
              setIsGenerateReportDialogOpen(true);
            }}
          >
            <FiTable className="mr-1" /> {t('generate')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditTemplate(row)}
            disabled={row.isSystem}
          >
            <FiEdit className="mr-1" /> {t('edit')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteTemplate(row.id)}
            disabled={row.isSystem}
          >
            <FiTrash2 className="mr-1" /> {t('delete')}
          </Button>
        </div>
      ),
      align: 'right',
    },
  ];
  
  // Available report entities
  const availableEntities = [
    { id: 'products', name: t('products') },
    { id: 'customers', name: t('customers') },
    { id: 'invoices', name: t('invoices') },
    { id: 'transactions', name: t('transactions') },
    { id: 'inventory', name: t('inventory') },
  ];
  
  // Available metrics
  const availableMetrics = [
    { id: 'count', name: t('count') },
    { id: 'sum', name: t('sum') },
    { id: 'average', name: t('average') },
    { id: 'min', name: t('min') },
    { id: 'max', name: t('max') },
  ];
  
  // Filter operators
  const filterOperators = [
    { id: 'equals', name: t('equals') },
    { id: 'notEquals', name: t('notEquals') },
    { id: 'greaterThan', name: t('greaterThan') },
    { id: 'lessThan', name: t('lessThan') },
    { id: 'contains', name: t('contains') },
    { id: 'notContains', name: t('notContains') },
  ];
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('customReports')}</h1>
          <p className="text-gray-600">{t('customReportsDescription')}</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
              <CardTitle>{t('reportTemplates')}</CardTitle>
              
              <Button onClick={() => setIsNewTemplateDialogOpen(true)}>
                <FiPlus className="mr-2" />
                {t('createTemplate')}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <div className="relative">
                  <Input
                    placeholder={t('searchTemplates')}
                    value={templateFilter.search}
                    onChange={(e) => setTemplateFilter({
                      ...templateFilter,
                      search: e.target.value
                    })}
                    className="pl-10"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div className="md:w-1/2">
                <Select 
                  value={templateFilter.type} 
                  onValueChange={(value) => setTemplateFilter({
                    ...templateFilter,
                    type: value as ReportType | ''
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('allReportTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allReportTypes')}</SelectItem>
                    <SelectItem value={ReportType.SALES}>{t('salesReports')}</SelectItem>
                    <SelectItem value={ReportType.INVENTORY}>{t('inventoryReports')}</SelectItem>
                    <SelectItem value={ReportType.ACCOUNTS_RECEIVABLE}>{t('accountsReceivableReports')}</SelectItem>
                    <SelectItem value={ReportType.CUSTOM}>{t('customReports')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <DataTable
                columns={templateColumns}
                data={templates}
                pagination
                initialPageSize={10}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Create/Edit Template Dialog */}
      <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? t('editTemplate') : t('createTemplate')}
            </DialogTitle>
            <DialogDescription>
              {t('templateDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('templateName')}</Label>
              <Input
                id="name"
                value={newTemplate.name || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder={t('enterTemplateName')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                value={newTemplate.description || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder={t('enterDescription')}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">{t('reportType')}</Label>
              <Select 
                value={newTemplate.type} 
                onValueChange={(value) => setNewTemplate({
                  ...newTemplate,
                  type: value as ReportType
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectReportType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportType.SALES}>{t('salesReports')}</SelectItem>
                  <SelectItem value={ReportType.INVENTORY}>{t('inventoryReports')}</SelectItem>
                  <SelectItem value={ReportType.ACCOUNTS_RECEIVABLE}>{t('accountsReceivableReports')}</SelectItem>
                  <SelectItem value={ReportType.CUSTOM}>{t('customReports')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="format">{t('defaultFormat')}</Label>
              <Select 
                value={newTemplate.defaultFormat} 
                onValueChange={(value) => setNewTemplate({
                  ...newTemplate,
                  defaultFormat: value as ReportFormat
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectFormat')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportFormat.PDF}>PDF</SelectItem>
                  <SelectItem value={ReportFormat.EXCEL}>Excel</SelectItem>
                  <SelectItem value={ReportFormat.CSV}>CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>{t('reportParameters')}</Label>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="entities">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FiTable className="mr-2" />
                      {t('dataEntities')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {availableEntities.map(entity => (
                        <div key={entity.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`entity-${entity.id}`} 
                            checked={reportParameters.entities.includes(entity.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportParameters({
                                  ...reportParameters,
                                  entities: [...reportParameters.entities, entity.id]
                                });
                              } else {
                                setReportParameters({
                                  ...reportParameters,
                                  entities: reportParameters.entities.filter(e => e !== entity.id)
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`entity-${entity.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {entity.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="metrics">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FiColumns className="mr-2" />
                      {t('metrics')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {availableMetrics.map(metric => (
                        <div key={metric.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`metric-${metric.id}`} 
                            checked={reportParameters.metrics.includes(metric.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportParameters({
                                  ...reportParameters,
                                  metrics: [...reportParameters.metrics, metric.id]
                                });
                              } else {
                                setReportParameters({
                                  ...reportParameters,
                                  metrics: reportParameters.metrics.filter(m => m !== metric.id)
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`metric-${metric.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {metric.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="filters">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FiFilter className="mr-2" />
                      {t('filters')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {reportParameters.filters.map((filter, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <Input 
                            placeholder={t('field')}
                            value={filter.field}
                            onChange={(e) => {
                              const newFilters = [...reportParameters.filters];
                              newFilters[index].field = e.target.value;
                              setReportParameters({
                                ...reportParameters,
                                filters: newFilters
                              });
                            }}
                          />
                          <Select 
                            value={filter.operator} 
                            onValueChange={(value) => {
                              const newFilters = [...reportParameters.filters];
                              newFilters[index].operator = value;
                              setReportParameters({
                                ...reportParameters,
                                filters: newFilters
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('operator')} />
                            </SelectTrigger>
                            <SelectContent>
                              {filterOperators.map(op => (
                                <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex space-x-2">
                            <Input 
                              placeholder={t('value')}
                              value={filter.value}
                              onChange={(e) => {
                                const newFilters = [...reportParameters.filters];
                                newFilters[index].value = e.target.value;
                                setReportParameters({
                                  ...reportParameters,
                                  filters: newFilters
                                });
                              }}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newFilters = reportParameters.filters.filter((_, i) => i !== index);
                                setReportParameters({
                                  ...reportParameters,
                                  filters: newFilters
                                });
                              }}
                              className="flex-shrink-0"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReportParameters({
                            ...reportParameters,
                            filters: [...reportParameters.filters, { field: '', operator: 'equals', value: '' }]
                          });
                        }}
                      >
                        <FiPlus className="mr-2" />
                        {t('addFilter')}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="grouping">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FiSettings className="mr-2" />
                      {t('groupingAndSorting')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="groupBy">{t('groupBy')}</Label>
                        <Input
                          id="groupBy"
                          value={reportParameters.groupBy}
                          onChange={(e) => setReportParameters({
                            ...reportParameters,
                            groupBy: e.target.value
                          })}
                          placeholder={t('fieldName')}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="sortBy">{t('sortBy')}</Label>
                        <Input
                          id="sortBy"
                          value={reportParameters.sortBy}
                          onChange={(e) => setReportParameters({
                            ...reportParameters,
                            sortBy: e.target.value
                          })}
                          placeholder={t('fieldName')}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>{t('sortDirection')}</Label>
                        <RadioGroup 
                          value={reportParameters.sortDirection} 
                          onValueChange={(value) => setReportParameters({
                            ...reportParameters,
                            sortDirection: value as 'asc' | 'desc'
                          })}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="asc" id="asc" />
                            <Label htmlFor="asc">{t('ascending')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="desc" id="desc" />
                            <Label htmlFor="desc">{t('descending')}</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTemplateDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveTemplate}>
              {t('saveTemplate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Generate Report Dialog */}
      <Dialog open={isGenerateReportDialogOpen} onOpenChange={setIsGenerateReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('generateReport')}</DialogTitle>
            <DialogDescription>
              {t('generateReportDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reportName">{t('reportName')}</Label>
              <Input
                id="reportName"
                value={newReport.name || ''}
                onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                placeholder={t('enterReportName')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="reportDescription">{t('description')}</Label>
              <Textarea
                id="reportDescription"
                value={newReport.description || ''}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                placeholder={t('enterDescription')}
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="format">{t('format')}</Label>
              <Select 
                value={newReport.format as string} 
                onValueChange={(value) => setNewReport({
                  ...newReport,
                  format: value as ReportFormat
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectFormat')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportFormat.PDF}>PDF</SelectItem>
                  <SelectItem value={ReportFormat.EXCEL}>Excel</SelectItem>
                  <SelectItem value={ReportFormat.CSV}>CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="frequency">{t('frequency')}</Label>
              <Select 
                value={newReport.frequency as string} 
                onValueChange={(value) => setNewReport({
                  ...newReport,
                  frequency: value as ReportFrequency
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectFrequency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportFrequency.ONCE}>{t('once')}</SelectItem>
                  <SelectItem value={ReportFrequency.DAILY}>{t('daily')}</SelectItem>
                  <SelectItem value={ReportFrequency.WEEKLY}>{t('weekly')}</SelectItem>
                  <SelectItem value={ReportFrequency.MONTHLY}>{t('monthly')}</SelectItem>
                  <SelectItem value={ReportFrequency.QUARTERLY}>{t('quarterly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>{t('dateRange')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs">{t('from')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={reportParameters.dateRange.from}
                    onChange={(e) => setReportParameters({
                      ...reportParameters,
                      dateRange: {
                        ...reportParameters.dateRange,
                        from: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs">{t('to')}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={reportParameters.dateRange.to}
                    onChange={(e) => setReportParameters({
                      ...reportParameters,
                      dateRange: {
                        ...reportParameters.dateRange,
                        to: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateReportDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleGenerateReport}>
              <FiTable className="mr-2" />
              {t('generate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
