/**
 * Modal Component
 * Accessible dialog using Radix UI with animations
 * AI-generated: 100%
 */

import { forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../styles/utils';
import { modalOverlay } from '../../utils/animations';

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

export const Modal = forwardRef(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      size = 'md',
      showClose = true,
      className,
    },
    ref
  ) => {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <AnimatePresence>
            {open && (
              <>
                {/* Overlay */}
                <Dialog.Overlay asChild>
                  <motion.div
                    {...modalOverlay}
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50"
                  />
                </Dialog.Overlay>

                {/* Content */}
                <Dialog.Content asChild>
                  <motion.div
                    ref={ref}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={cn(
                      'fixed left-1/2 top-1/2 z-50',
                      '-translate-x-1/2 -translate-y-1/2',
                      'w-full',
                      modalSizes[size],
                      'bg-white rounded-xl shadow-2xl',
                      'focus:outline-none',
                      className
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-200">
                      <div className="flex-1 pr-8">
                        {title && (
                          <Dialog.Title className="text-xl font-semibold text-gray-900">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="mt-2 text-sm text-gray-500">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>

                      {/* Close Button */}
                      {showClose && (
                        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-5 h-5" />
                        </Dialog.Close>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6">{children}</div>
                  </motion.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

Modal.displayName = 'Modal';

export function ModalFooter({ children, className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3',
        'pt-6 border-t border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
}

export default Modal;
