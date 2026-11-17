'use client';

import { useId, useState } from 'react';
import { RateStar } from '../RateStar/RateStart';

type RateProps = {
  value: number | null;
  maxValue: number;
  onChange: (value: number) => void;
};

export const RateInput = ({ value, maxValue, onChange }: RateProps) => {
  const name = useId();
  const [hoveredRate, setHoveredRate] = useState<number | null>(null);
  const displayedRate = hoveredRate ?? value ?? 0;

  return (
    <span
      className="inline-flex gap-1"
      onMouseLeave={() => setHoveredRate(null)}
    >
      {Array.from({ length: maxValue }, (_, i) => i + 1).map((rate) => (
        <label
          key={rate}
          className="inline-flex size-6 cursor-pointer items-center justify-center"
          onMouseEnter={() => setHoveredRate(rate)}
        >
          <input
            type="radio"
            name={name}
            checked={value === rate}
            className="sr-only"
            onChange={() => onChange(rate)}
          />
          <span className="sr-only">{`${rate} ${rate === 1 ? 'звезда' : 'звезды'}`}</span>
          <RateStar variant={displayedRate >= rate ? 'filled' : 'empty'} />
        </label>
      ))}
    </span>
  );
};
