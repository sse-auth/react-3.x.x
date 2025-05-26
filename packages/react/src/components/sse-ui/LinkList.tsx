import { cloneElement } from '../../lib/utils';
import * as Accordion from '../radix-ui/Accordion';
import Button from './Button';
import { button } from '@sse-ui/themer';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const Link = ({
  isActive = false,
  link,
  children,
}: {
  isActive?: boolean;
  children: ReactNode;
  link: string;
}) => {
  return (
    <Button.Root
      href={link}
      variant={isActive ? 'outlined' : 'ghost'}
      intent="gray"
      className={twMerge(
        'justify-start gap-3.5 pr-3 pl-[42px]',
        isActive &&
          'dark:[--btn-border-color:theme(colors.transparent)] bg-white dark:bg-gray-500/10 dark:!shadow-none'
      )}
    >
      <Button.Label className="text-sm">{children}</Button.Label>
    </Button.Root>
  );
};

export const Group = ({ children, value }: { value: string; children: ReactNode }) => {
  return <Accordion.Item value={value}>{children}</Accordion.Item>;
};

export const Content = ({ children }: { children: ReactNode }) => (
  <Accordion.Content className="data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown space-y-1 overflow-hidden">
    {children}
  </Accordion.Content>
);

export const Trigger = ({ children }: { children: ReactNode }) => (
  <Accordion.Header>
    <Accordion.Trigger
      className={button.ghost({
        intent: 'gray',
        size: 'md',
        className: 'w-full justify-start gap-3.5 px-3 text-sm',
      })}
    >
      {children}
      <ChevronDown className="ml-auto size-4 opacity-75 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" />
    </Accordion.Trigger>
  </Accordion.Header>
);

export const Icon = ({ children, className }: { children: ReactNode; className?: string }) =>
  cloneElement(children as React.ReactElement, twMerge('size-4', className));

export const Root = ({ children }: { children: ReactNode }) => {
  return (
    <Accordion.Root type="multiple" className="space-y-1">
      {children}
    </Accordion.Root>
  );
};
