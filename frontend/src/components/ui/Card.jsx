/**
 * Card Component
 * Container with variants: default, elevated, flat, glass
 * AI-generated: 100%
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../styles/utils';

const cardVariants = {
  default: 'bg-white shadow-md border border-gray-100',
  elevated: 'bg-white shadow-lg border border-gray-100',
  flat: 'bg-white border border-gray-200',
  glass: 'glass shadow-xl',
};

export const Card = forwardRef(({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        'rounded-xl transition-shadow duration-200',
        cardVariants[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-lg cursor-pointer',
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card;
