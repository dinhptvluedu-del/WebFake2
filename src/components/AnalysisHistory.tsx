/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { HistoryItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const AnalysisHistory: React.FC = () => {
  const { token, user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [filterClass, setFilterClass] = useState<'all' | 'fake' | 'real'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'conf_desc'>('date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter: filterClass,
        search: searchQuery,
      });

      const res = await fetch(`/api/history?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        let fetchedItems: HistoryItem[] = data.items || [];

        // In-memory sort if requested
        if (sortBy === 'date_asc') {
          fetchedItems.sort((a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime());
        } else if (sortBy === 'conf_desc') {
          fetchedItems.sort((a, b) => b.confidenceScore - a.confidenceScore);
        }

        setItems(fetchedItems);
        setTotal(data.total || 0);
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, filterClass, sortBy, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setItems(items.filter((it) => it.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      }
    } catch {
      // Handle error
    }
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const headers = ['ID', 'Date', 'Class', 'Confidence', 'Excerpt'];
    const rows = items.map((it) => [
      it.id,
      new Date(it.analyzedAt).toLocaleString(),
      it.predictedClass,
      `${it.confidenceScore}%`,
      `"${it.textExcerpt.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `veritas_bilstm_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="w-full space-y-6">
      {/* Header and Filter Controls */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <History className="w-6 h-6 text-indigo-500" />
              <span>Bi-LSTM Verification History</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse, filter, and inspect previous news articles processed by the bidirectional neural network.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={exportCSV}
              disabled={items.length === 0}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 transition-colors disabled:opacity-40"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchHistory}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Refresh records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, headlines, excerpt..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Category Filter */}
          <div className="sm:col-span-4 flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setFilterClass('all');
                setPage(1);
              }}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterClass === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => {
                setFilterClass('fake');
                setPage(1);
              }}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterClass === 'fake'
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Fake News
            </button>
            <button
              onClick={() => {
                setFilterClass('real');
                setPage(1);
              }}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterClass === 'real'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Real News
            </button>
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="conf_desc">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Records Grid / Table */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading analysis records...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Analysis Records Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or analyze a news article in the analyzer tab.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isFake = item.predictedClass === 'Fake News';
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left content */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isFake
                          ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isFake ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      <span>{item.predictedClass}</span>
                    </span>

                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {item.confidenceScore}% confidence
                    </span>

                    <span className="text-slate-300 dark:text-slate-700">•</span>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.analyzedAt).toLocaleDateString()} {new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      #{item.id.replace('pred_', '').substring(0, 8)}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.textExcerpt}
                  </p>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing page <strong className="text-slate-700 dark:text-slate-300">{page}</strong> of{' '}
              <strong className="text-slate-700 dark:text-slate-300">{totalPages}</strong> ({total} total predictions)
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedItem.predictedClass === 'Fake News'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  {selectedItem.predictedClass}
                </span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {selectedItem.confidenceScore}% Confidence
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 block">Fake Probability</span>
                <span className="font-mono font-bold text-rose-600">
                  {(selectedItem.fakeProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 block">Real Probability</span>
                <span className="font-mono font-bold text-emerald-600">
                  {(selectedItem.realProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 block">Sequence Length</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedItem.sequenceLength || 128} tokens
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 block">Inference Speed</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedItem.inferenceTimeMs || 24}ms
                </span>
              </div>
            </div>

            {/* Full text */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Analyzed Article Text
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed max-h-60 overflow-y-auto">
                {selectedItem.fullText || selectedItem.textExcerpt}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
              <span>Timestamp: {new Date(selectedItem.analyzedAt).toLocaleString()}</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
