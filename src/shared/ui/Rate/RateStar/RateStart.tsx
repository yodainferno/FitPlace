import { Star } from 'lucide-react';

type RateProps = {
    variant: 'filled' | 'empty'
}
export const RateStar = ({variant}: RateProps) => {
    return (
        <Star
            aria-hidden="true"
            color="#f59e0b"
            fill={variant === 'filled' ? '#f59e0b' : 'none'}
            size={20}
        />
    );
};
