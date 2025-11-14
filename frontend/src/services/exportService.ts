/**
 * Download/Export Utility Service
 * Provides functions for exporting data in various formats (CSV, PDF, JSON)
 */

export interface ExportOptions {
  filename?: string;
  format?: 'csv' | 'pdf' | 'json';
}

/**
 * Export data as CSV
 */
export const exportAsCSV = (data: Array<Record<string, any>>, filename: string = 'export.csv') => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Export data as JSON
 */
export const exportAsJSON = (data: any, filename: string = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Export data as formatted text
 */
export const exportAsText = (content: string, filename: string = 'export.txt') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Generate HTML report and export as document
 */
export const exportAsHTML = (html: string, filename: string = 'report.html') => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Generic blob download function
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate complaint report as formatted text
 */
export const generateComplaintReport = (complaint: any): string => {
  const date = new Date().toLocaleDateString();
  const report = `
╔════════════════════════════════════════════════════════════════╗
║           CYBER FRAUD COMPLAINT REPORT                        ║
║           Odisha Police Cyber Fraud Support System            ║
╚════════════════════════════════════════════════════════════════╝

Report Generated: ${date}

─────────────────────────────────────────────────────────────────
COMPLAINT DETAILS
─────────────────────────────────────────────────────────────────

Complaint ID:              ${complaint.complaint_id}
Status:                    ${complaint.status}
Fraud Type:                ${complaint.fraud_type}
Amount Lost:               ₹${complaint.amount_lost?.toLocaleString() || 'N/A'}
Amount Recovered:          ₹${complaint.amount_recovered?.toLocaleString() || '0'}
Date Filed:                ${new Date(complaint.created_at).toLocaleDateString()}
Priority Case:             ${complaint.is_priority ? 'Yes' : 'No'}
Funds Frozen:              ${complaint.is_funds_frozen ? 'Yes' : 'No'}

─────────────────────────────────────────────────────────────────
VICTIM INFORMATION
─────────────────────────────────────────────────────────────────

Victim Phone:              ${complaint.victim_phone}
District:                  ${complaint.district || 'N/A'}

─────────────────────────────────────────────────────────────────
FRAUD DETAILS
─────────────────────────────────────────────────────────────────

Transaction ID:            ${complaint.transaction_id || 'N/A'}
Accused Account:           ${complaint.accused_account || 'N/A'}
Accused Bank:              ${complaint.accused_bank || 'N/A'}
Description:               ${complaint.description || 'N/A'}

─────────────────────────────────────────────────────────────────
CASE STATUS
─────────────────────────────────────────────────────────────────

FIR Number:                ${complaint.fir_number || 'Pending'}
Current Status:            ${complaint.status}

─────────────────────────────────────────────────────────────────
RECOVERY INFORMATION
─────────────────────────────────────────────────────────────────

Total Lost:                ₹${complaint.amount_lost?.toLocaleString() || '0'}
Total Recovered:           ₹${complaint.amount_recovered?.toLocaleString() || '0'}
Recovery Rate:             ${complaint.amount_lost ? ((complaint.amount_recovered || 0) / complaint.amount_lost * 100).toFixed(2) : '0'}%

═════════════════════════════════════════════════════════════════

This is an official document generated from the Cyber Fraud Support System.
For further assistance, call: 1930

═════════════════════════════════════════════════════════════════
  `;
  return report;
};

/**
 * Generate analytics report as formatted text
 */
export const generateAnalyticsReport = (analytics: any): string => {
  const date = new Date().toLocaleDateString();
  const report = `
╔════════════════════════════════════════════════════════════════╗
║           CYBER FRAUD ANALYTICS REPORT                        ║
║           Odisha Police Cyber Fraud Support System            ║
╚════════════════════════════════════════════════════════════════╝

Report Generated: ${date}
Period: ${analytics.period?.start_date} to ${analytics.period?.end_date}

─────────────────────────────────────────────────────────────────
SUMMARY STATISTICS
─────────────────────────────────────────────────────────────────

Total Cases:               ${analytics.total_cases || 0}
Total Amount Lost:         ₹${(analytics.total_lost || 0).toLocaleString()}
Total Amount Recovered:    ₹${(analytics.total_recovered || 0).toLocaleString()}
Recovery Rate:             ${analytics.recovery_rate || '0%'}

Cases Resolved:            ${analytics.resolved || 0}
Cases Pending:             ${analytics.pending || 0}

─────────────────────────────────────────────────────────────────
FRAUD TYPE BREAKDOWN (if available)
─────────────────────────────────────────────────────────────────

${
  analytics.fraud_types
    ? analytics.fraud_types
        .map(
          (ft: any) =>
            `${ft.fraud_type.padEnd(20)} │ Cases: ${ft.count.toString().padStart(4)} │ Amount: ₹${(ft.total_amount || 0).toLocaleString().padStart(12)}`
        )
        .join('\n')
    : 'N/A'
}

─────────────────────────────────────────────────────────────────
DISTRICT BREAKDOWN (if available)
─────────────────────────────────────────────────────────────────

${
  analytics.districts
    ? analytics.districts
        .map(
          (dt: any) =>
            `${dt.district.padEnd(20)} │ Cases: ${dt.cases.toString().padStart(4)} │ Recovery: ${dt.recovery_rate.padStart(7)}`
        )
        .join('\n')
    : 'N/A'
}

═════════════════════════════════════════════════════════════════

For detailed reports, contact: cybercell.odisha@police.gov.in

═════════════════════════════════════════════════════════════════
  `;
  return report;
};

/**
 * Format timestamp
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
