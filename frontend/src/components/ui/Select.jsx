/**
 * Select Component
 * Custom select using Radix UI with search capability
 * AI-generated: 100%
 */

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../styles/utils';

export function Select({
  value,
  onValueChange,
  children,
  placeholder = 'Select...',
  disabled,
  className
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        className={cn(
          'flex h-10 w-full items-center justify-between',
          'rounded-lg border border-gray-300 bg-white px-4 py-2',
          'text-sm text-gray-900 placeholder:text-gray-400',
          'transition-all duration-200',
          'hover:border-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          'data-[placeholder]:text-gray-400',
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            'relative z-50 min-w-[8rem] overflow-hidden',
            'rounded-lg border border-gray-200 bg-white shadow-lg',
            'animate-in fade-in-0 zoom-in-95'
          )}
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="p-1">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export function SelectItem({ value, children, disabled }) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center',
        'rounded-md py-2 pl-8 pr-2 text-sm outline-none',
        'transition-colors',
        'hover:bg-primary-50 hover:text-primary-900',
        'focus:bg-primary-50 focus:text-primary-900',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-primary-600" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({ children }) {
  return (
    <SelectPrimitive.Label className="py-1.5 pl-8 pr-2 text-xs font-semibold text-gray-500">
      {children}
    </SelectPrimitive.Label>
  );
}

export function SelectSeparator() {
  return (
    <SelectPrimitive.Separator className="-mx-1 my-1 h-px bg-gray-200" />
  );
}

export default Select;
