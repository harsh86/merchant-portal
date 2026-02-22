/**
 * Table Component
 * Sortable, selectable table with mobile card view
 * AI-generated: 100%
 */

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { cn } from '../../styles/utils';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, sticky = true }) {
  return (
    <thead
      className={cn(
        'bg-gray-50 border-y border-gray-200',
        sticky && 'sticky top-0 z-10',
        className
      )}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className, loading, empty, emptyProps }) {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan="100%" className="p-0">
            <div className="p-6">
              <Skeleton variant="text" className="mb-3" />
              <Skeleton variant="text" className="mb-3" />
              <Skeleton variant="text" className="mb-3" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (empty) {
    return (
      <tbody>
        <tr>
          <td colSpan="100%" className="p-0">
            <EmptyState {...emptyProps} />
          </td>
        </tr>
      </tbody>
    );
  }

  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className, selected, onClick, hover = true }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-gray-100 transition-colors',
        hover && 'hover:bg-gray-50',
        onClick && 'cursor-pointer',
        selected && 'bg-primary-50',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  sortable,
  sortDirection,
  onSort,
  align = 'left',
}) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={cn(
        'px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider',
        alignClasses[align],
        sortable && 'cursor-pointer select-none hover:bg-gray-100',
        className
      )}
    >
      <div className={cn('flex items-center gap-2', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
        <span>{children}</span>
        {sortable && (
          <span className="text-gray-400">
            {!sortDirection && <ArrowUpDown className="w-4 h-4" />}
            {sortDirection === 'asc' && <ArrowUp className="w-4 h-4 text-primary-600" />}
            {sortDirection === 'desc' && <ArrowDown className="w-4 h-4 text-primary-600" />}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({ children, className, align = 'left' }) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={cn(
        'px-6 py-4 text-sm text-gray-900',
        alignClasses[align],
        className
      )}
    >
      {children}
    </td>
  );
}

// Mobile Card View for Tables
export function TableCardView({ data, renderCard, emptyProps, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState {...emptyProps} />;
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => renderCard(item, index))}
    </div>
  );
}

// Sortable Table Hook
export function useSortableTable(data, initialSort = null) {
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) return 0;

    const comparison = aValue > bValue ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { sortedData, sortConfig, requestSort };
}

// Selectable Table Hook
export function useSelectableTable(data, idKey = 'id') {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((item) => item[idKey])));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  return {
    selectedIds,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected: (id) => selectedIds.has(id),
    isAllSelected: selectedIds.size === data.length && data.length > 0,
    hasSelection: selectedIds.size > 0,
  };
}

export default Table;
