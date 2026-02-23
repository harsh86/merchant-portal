/**
 * Transactions Page - Modernized
 * Complete redesign with new UI components and improved UX
 * AI-generated: 100%
 */

import { useState, useMemo } from 'react';
import { Search, Download, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

import { useTransactions } from '../hooks/useTransactions';
import { mockTransactions, mockPagination } from '../utils/mockData';
import { getStatusColor, formatCurrency, formatDate, capitalize } from '../utils/helpers';
import TransactionDetailModal from '../components/TransactionDetailModal';
import { fadeIn } from '../utils/animations';

import {
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCardView,
  useSortableTable,
  EmptyState,
} from '../components/ui';

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    source: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

    if (filters.source) params.source = filters.source;
    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.date_from = new Date(filters.dateFrom).toISOString();
    if (filters.dateTo) params.date_to = new Date(filters.dateTo).toISOString();

    return params;
  }, [filters, currentPage, pageSize]);

  // Use mock data for now (replace with real API later)
  const isLoading = false;
  const isError = false;
  const error = null;
  const data = { success: true, data: mockTransactions, pagination: mockPagination };

  const transactions = data?.data || [];
  const pagination = data?.pagination || mockPagination;

  // Filter by search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.id.toLowerCase().includes(query) ||
        t.source.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  // Sortable table
  const { sortedData, sortConfig, requestSort } = useSortableTable(filteredTransactions, {
    key: 'created_at',
    direction: 'desc',
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ source: '', status: '', dateFrom: '', dateTo: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export transactions');
  };

  // Mobile card renderer
  const renderMobileCard = (transaction) => (
    <Card
      key={transaction.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedTransaction(transaction)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-gray-500 truncate">
              {transaction.id}
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>
          <Badge variant={transaction.status === 'completed' ? 'success' : transaction.status === 'failed' ? 'error' : 'default'}>
            {capitalize(transaction.status)}
          </Badge>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Source:</span>
          <span className="text-gray-900 font-medium capitalize">{transaction.source}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Date:</span>
          <span className="text-gray-900">{formatDate(transaction.created_at)}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} total transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
            size="md"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <Input
          placeholder="Search by ID, source, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          leftIcon={<Search className="w-4 h-4" />}
          size="lg"
        />
      </Card>

      {/* Filter Bar */}
      <Card>
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <Badge variant="primary">{activeFiltersCount} active</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            rightIcon={showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showFilters ? 'Hide' : 'Show'}
          </Button>
        </div>

        {/* Filter Controls */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Source
                  </label>
                  <Select
                    value={filters.source || undefined}
                    onValueChange={(value) => handleFilterChange('source', value === 'all' ? '' : value)}
                    placeholder="All Sources"
                  >
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <Select
                    value={filters.status || undefined}
                    onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                    placeholder="All Statuses"
                  >
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </Select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date From
                  </label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date To
                  </label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filters.source && (
                    <Badge variant="secondary">
                      Source: {filters.source}
                      <button
                        onClick={() => handleFilterChange('source', '')}
                        className="ml-1.5 hover:text-error-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.status && (
                    <Badge variant="secondary">
                      Status: {filters.status}
                      <button
                        onClick={() => handleFilterChange('status', '')}
                        className="ml-1.5 hover:text-error-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.dateFrom && (
                    <Badge variant="secondary">
                      From: {filters.dateFrom}
                      <button
                        onClick={() => handleFilterChange('dateFrom', '')}
                        className="ml-1.5 hover:text-error-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.dateTo && (
                    <Badge variant="secondary">
                      To: {filters.dateTo}
                      <button
                        onClick={() => handleFilterChange('dateTo', '')}
                        className="ml-1.5 hover:text-error-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  disabled={activeFiltersCount === 0 && !searchQuery}
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Transactions Table/Cards */}
      {isMobile ? (
        <TableCardView
          data={sortedData}
          renderCard={renderMobileCard}
          loading={isLoading}
          emptyProps={{
            title: 'No transactions found',
            message: 'Try adjusting your filters or search query',
            action: activeFiltersCount > 0 && (
              <Button variant="primary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ),
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader sticky>
              <TableRow>
                <TableHead
                  sortable
                  sortDirection={sortConfig?.key === 'id' ? sortConfig.direction : null}
                  onSort={() => requestSort('id')}
                >
                  ID
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortConfig?.key === 'source' ? sortConfig.direction : null}
                  onSort={() => requestSort('source')}
                >
                  Source
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortConfig?.key === 'amount' ? sortConfig.direction : null}
                  onSort={() => requestSort('amount')}
                  align="right"
                >
                  Amount
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortConfig?.key === 'status' ? sortConfig.direction : null}
                  onSort={() => requestSort('status')}
                >
                  Status
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortConfig?.key === 'created_at' ? sortConfig.direction : null}
                  onSort={() => requestSort('created_at')}
                >
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody
              loading={isLoading}
              empty={sortedData.length === 0}
              emptyProps={{
                title: 'No transactions found',
                message: 'Try adjusting your filters or search query',
                action: activeFiltersCount > 0 && (
                  <Button variant="primary" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ),
              }}
            >
              {sortedData.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  onClick={() => setSelectedTransaction(transaction)}
                  hover
                >
                  <TableCell>
                    <span className="font-mono text-xs text-gray-500">
                      {transaction.id.substring(0, 8)}...
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-medium">{transaction.source}</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-semibold">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === 'completed'
                          ? 'success'
                          : transaction.status === 'failed'
                          ? 'error'
                          : transaction.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {capitalize(transaction.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {formatDate(transaction.created_at)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Enhanced Pagination */}
          {sortedData.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.page}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span>
                  </p>

                  {/* Page Size Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show:</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </Select>
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers (show max 5) */}
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </motion.div>
  );
};

export default Transactions;
