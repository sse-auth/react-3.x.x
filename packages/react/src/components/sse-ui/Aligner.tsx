import React from 'react';
import { aligner, type AlignerProps as AlignerVariants } from '@sse-ui/themer';

export interface AlignerProps extends React.HTMLAttributes<HTMLDivElement>, AlignerVariants {}

export const Aligner = React.forwardRef<HTMLDivElement, AlignerProps>(
  ({ className, children, fromRight, ...props }, forwardedRef) => {
    return (
      <div
        className={aligner({ fromRight, className })}
        ref={forwardedRef}
        children={children}
        {...props}
      />
    );
  }
);
