'use client';

import { motion } from 'framer-motion';
import { 
  Download,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

export function ExportData() {
  const { state } = usePipeline();

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      metrics: state.metrics,
      transactions: state.transactions,
      retryQueue: state.retryQueue,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Currency', 'Sender', 'Recipient', 'Status', 'Fraud Score', 'Timestamp'];
    const rows = state.transactions.map((tx) => [
      tx.id,
      tx.type,
      tx.amount,
      tx.currency,
      tx.sender,
      tx.recipient,
      tx.status,
      tx.fraudScore,
      tx.timestamp,
    ]);
    
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportJSON}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <FileJson className="w-4 h-4" />
        JSON
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportCSV}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <FileSpreadsheet className="w-4 h-4" />
        CSV
      </motion.button>
    </div>
  );
}
