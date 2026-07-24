import { cn } from '../lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'critical' | 'high' | 'medium' | 'low' | 'default';
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
    const variants = {
        critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/30',
        medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
        low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
        default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    };

    return (
        <span 
            className={cn(`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${variants[variant]}`, className)} 
            {...props}
        >
            {children}
        </span>
    );
}
