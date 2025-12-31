'use client';

import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { TransactionType, TransactionStatus } from '@/types';

interface FilterState {
  search: string;
  type: TransactionType | 'all';
  status: TransactionStatus | 'all';
  minAmount: string;
  maxAmount: string;
}

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      type: 'all',
      status: 'all',
      minAmount: '',
      maxAmount: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.type !== 'all' || 
    filters.status !== 'all' ||
    filters.minAmount ||
    filters.maxAmount;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
          />
        </div>

        {/* Type filter */}
        <select
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Types</option>
          <option value="transfer">Transfer</option>
          <option value="payment">Payment</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2 rounded-lg transition-colors ${
            showAdvanced ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={clearFilters}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Amount:</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minAmount}
              onChange={(e) => updateFilter('minAmount', e.target.value)}
              className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={(e) => updateFilter('maxAmount', e.target.value)}
              className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
