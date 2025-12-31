'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipeline } from '@/context/PipelineContext';
import { formatCurrency } from '@/lib/utils';
import { 
  FileJson, Download, Copy, Check, 
  Table, FileSpreadsheet, Printer 
} from 'lucide-react';

type ExportFormat = 'json' | 'csv' | 'clipboard';

export function ExportPanel() {
  const { state } = usePipeline();
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');

  const generateJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      metrics: state.metrics,
      transactions: state.transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        sender: t.sender,
        recipient: t.recipient,
        fraudScore: t.fraudScore,
        timestamp: t.timestamp,
      })),
    };
    return JSON.stringify(data, null, 2);
  };

  const generateCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Currency', 'Status', 'Sender', 'Recipient', 'Fraud Score', 'Timestamp'];
    const rows = state.transactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.currency,
      t.status,
      t.sender,
      t.recipient,
      t.fraudScore,
      t.timestamp.toISOString(),
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const handleExport = (format: ExportFormat) => {
    const content = format === 'csv' ? generateCSV() : generateJSON();
    
    if (format === 'clipboard') {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-export-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewData = state.transactions.slice(0, 3);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Export Data</span>
        </div>
        <span className="text-xs text-gray-500">
          {state.transactions.length} transactions
        </span>
      </div>

      {/* Format selector */}
      <div className="flex gap-2 mb-4">
        {[
          { format: 'json' as const, icon: <FileJson className="w-3 h-3" />, label: 'JSON' },
          { format: 'csv' as const, icon: <FileSpreadsheet className="w-3 h-3" />, label: 'CSV' },
        ].map(({ format, icon, label }) => (
          <button
            key={format}
            onClick={() => setExportFormat(format)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              exportFormat === format
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-transparent'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4 max-h-32 overflow-auto">
        <pre className="text-[10px] text-gray-400 font-mono">
          {exportFormat === 'csv' 
            ? `ID,Type,Amount,Currency,Status...\n${previewData.map(t => `${t.id.slice(0, 8)},${t.type},${t.amount},...`).join('\n')}`
            : `{\n  "transactions": [\n    ${previewData.length > 0 ? `{ "id": "${previewData[0]?.id?.slice(0, 8)}...", ... }` : '...'}\n  ]\n}`
          }
        </pre>
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport(exportFormat)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport('clipboard')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 text-green-400"
              >
                <Check className="w-4 h-4" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
