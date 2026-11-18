import { Star } from 'lucide-react';
import { cn } from '@/src/shared/lib';

type RateProps = {
  variant: 'filled' | 'empty';
};

export const RateStar = ({ variant }: RateProps) => (
  <Star
    aria-hidden="true"
    className={cn(
      'text-rating',
      variant === 'filled' ? 'fill-current' : 'fill-none',
    )}
    size={20}
  />
);
