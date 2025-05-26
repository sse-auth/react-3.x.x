import Button from './Button';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const Link = ({
  isActive = false,
  label,
  link,
  children,
}: {
  isActive?: boolean;
  children?: ReactNode;
  label?: string;
  link: string;
}) => {
  return (
    <Button.Root
      href={link}
      variant={isActive ? 'outlined' : 'ghost'}
      intent="gray"
      className={twMerge(
        'justify-start gap-3.5 px-4',
        isActive &&
          'dark:[--btn-border-color:theme(colors.transparent)] bg-white dark:bg-gray-500/10 dark:!shadow-none'
      )}
      aria-label={label}
    >
      <Button.Icon size="sm" type="leading">
        {children}
      </Button.Icon>
      <Button.Label className="text-sm">{label}</Button.Label>
    </Button.Root>
  );
};

export const Root = ({
  isActive = false,
  link,
  children,
}: {
  isActive?: boolean;
  children: ReactNode;
  link: string;
}) => (
  <Button.Root
    href={link}
    variant={isActive ? 'outlined' : 'ghost'}
    intent="gray"
    className={twMerge(
      'justify-start gap-3.5 px-4',
      isActive &&
        'dark:[--btn-border-color:theme(colors.transparent)] bg-white dark:bg-gray-500/10 dark:!shadow-none'
    )}
  >
    {children}
  </Button.Root>
);

export const Icon = ({ children }: { children: ReactNode }) => (
  <Button.Icon size="sm" type="leading">
    {children}
  </Button.Icon>
);

export const Label = ({ children }: { children: ReactNode }) => (
  <Button.Label className="text-sm">{children}</Button.Label>
);
