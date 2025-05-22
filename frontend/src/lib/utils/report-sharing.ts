/**
 * Utilities for report sharing and exporting
 */

/**
 * Formats and prepares report data for various export formats
 */
export function prepareReportForExport(reportData: any, format: 'csv' | 'excel' | 'pdf' | 'json'): any {
  switch (format) {
    case 'csv':
      return prepareForCSV(reportData);
    case 'excel':
      return prepareForExcel(reportData);
    case 'pdf':
      return prepareForPDF(reportData);
    case 'json':
      return prepareForJSON(reportData);
    default:
      return reportData;
  }
}

/**
 * Prepares data specifically for CSV format
 */
function prepareForCSV(data: any): any {
  // Handle nested data structures commonly found in reports
  if (Array.isArray(data)) {
    return data;
  } 
  
  // For complex reports with multiple sections, flatten the data structure
  if (typeof data === 'object' && data !== null) {
    if (data.tableData) {
      // If there's direct table data, prioritize it for export
      return data.tableData;
    } 
    
    // Check for common data structures in our reports
    const possibleArrays = ['items', 'rows', 'data', 'transactions', 'records', 'results'];
    for (const key of possibleArrays) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        return data[key];
      }
    }
    
    // If we can't find a clear array, try to convert the object itself
    if (Object.keys(data).length > 0) {
      return [data];
    }
  }
  
  return [];
}

/**
 * Prepares data specifically for Excel format
 */
function prepareForExcel(data: any): any {
  // Excel can handle more complex data with multiple sheets
  const result: any = {};
  
  // Handle summary data
  if (data.summary) {
    result.summary = formatSummaryForExcel(data.summary);
  }
  
  // Handle table data
  if (data.tableData) {
    result.data = data.tableData;
  }
  
  // Handle chart data for Excel charts
  if (data.chartData) {
    // Convert different chart formats to Excel-friendly format
    Object.entries(data.chartData).forEach(([key, chartData]) => {
      result[key] = chartData;
    });
  }
  
  return result;
}

/**
 * Formats summary data into a table format for Excel
 */
function formatSummaryForExcel(summary: Record<string, any>): Array<{key: string, value: any}> {
  return Object.entries(summary).map(([key, value]) => ({
    key,
    value
  }));
}

/**
 * Prepares data specifically for PDF format
 */
function prepareForPDF(data: any): any {
  // PDFs typically need specific layout information
  return {
    ...data,
    // Add any PDF-specific formatting or layout information
    layout: {
      orientation: determinePDFOrientation(data),
      includeCharts: true,
      includeHeader: true,
      includeFooter: true,
    }
  };
}

/**
 * Determines the best PDF orientation based on data
 */
function determinePDFOrientation(data: any): 'portrait' | 'landscape' {
  // Check if we have wide table data
  if (data.tableData && Array.isArray(data.tableData) && data.tableData[0]) {
    const columnCount = Object.keys(data.tableData[0]).length;
    // If we have many columns, use landscape
    if (columnCount >= 6) {
      return 'landscape';
    }
  }
  return 'portrait';
}

/**
 * Prepares data specifically for JSON format
 */
function prepareForJSON(data: any): any {
  // Create a clean version of the data, removing any internal or temporary properties
  const { _metadata, _status, _internal, ...cleanData } = data;
  return cleanData;
}

/**
 * Creates a shareable URL for a report
 */
export function createReportShareURL(reportId: string, options: { 
  format?: string; 
  public?: boolean; 
  expiration?: number; // expiration in hours
  viewOnly?: boolean;
}): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  
  if (options.format) {
    params.append('format', options.format);
  }
  
  if (options.public) {
    params.append('access', 'public');
  }
  
  if (options.expiration) {
    const expires = new Date();
    expires.setHours(expires.getHours() + options.expiration);
    params.append('expires', expires.toISOString());
  }
  
  if (options.viewOnly) {
    params.append('mode', 'view');
  }
  
  // Generate a unique share token
  const shareToken = generateShareToken();
  params.append('token', shareToken);
  
  return `${baseUrl}/shared-reports/${reportId}?${params.toString()}`;
}

/**
 * Generates a secure token for report sharing
 */
function generateShareToken(): string {
  // In a real implementation, this would be generated server-side
  // This is just a simplified client-side version for demonstration
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Sends a report via email
 */
export async function emailReport(
  reportId: string, 
  recipients: string[], 
  subject: string, 
  message: string,
  format: string = 'pdf'
): Promise<boolean> {
  try {
    // This would call your backend API to handle the email
    const response = await fetch(`/api/reports/${reportId}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients,
        subject,
        message,
        format,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send report email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending report email:', error);
    return false;
  }
}

/**
 * Schedule automated report delivery
 */
export async function scheduleReportDelivery(
  reportId: string,
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly',
    dayOfWeek?: number, // 0-6, where 0 is Sunday
    dayOfMonth?: number, // 1-31
    time: string, // 24-hour format, e.g. '14:30'
    timezone?: string,
  },
  delivery: {
    email?: string[],
    format?: 'pdf' | 'excel' | 'csv',
    subject?: string,
    message?: string,
  }
): Promise<{success: boolean, jobId?: string}> {
  try {
    // This would call your backend API to schedule the report
    const response = await fetch(`/api/reports/${reportId}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schedule,
        delivery,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule report');
    }
    
    const result = await response.json();
    return {
      success: true,
      jobId: result.jobId,
    };
  } catch (error) {
    console.error('Error scheduling report:', error);
    return {
      success: false,
    };
  }
}

/**
 * Creates an embedded report iframe code
 */
export function createEmbeddedReportCode(reportId: string, options: {
  width?: string;
  height?: string;
  showControls?: boolean;
  allowFullscreen?: boolean;
}): string {
  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/embedded-reports/${reportId}`;
  
  const params = new URLSearchParams();
  if (options.showControls === false) {
    params.append('controls', 'false');
  }
  
  // Generate a secure embed token
  const embedToken = generateShareToken();
  params.append('token', embedToken);
  
  const url = `${embedUrl}?${params.toString()}`;
  
  const width = options.width || '100%';
  const height = options.height || '600px';
  const allowFullscreen = options.allowFullscreen !== false;
  
  return `<iframe 
  src="${url}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  ${allowFullscreen ? 'allowfullscreen' : ''}
></iframe>`;
}
