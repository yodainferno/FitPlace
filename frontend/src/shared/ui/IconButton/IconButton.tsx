import type { ComponentProps } from 'react';
import { cn } from '@/src/shared/lib';

type IconButtonProps = ComponentProps<'button'> & {
  label: string;
};

export function IconButton({
  label,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid size-8 shrink-0 place-items-center rounded border-0 bg-transparent text-muted-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'enabled:hover:bg-primary/10 enabled:hover:text-primary disabled:cursor-default disabled:opacity-40',
        className,
      )}
    />
  );
}
