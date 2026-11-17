import { RateStar } from '../RateStar/RateStart';

type RateProps = {
    value: number | null
    maxValue: number
    srLabel?: (value: number | null) => string
}
export const RateDisplay = (props: RateProps) => {
    const {
        value,
        maxValue,
        srLabel,
    } = props;

    const label = srLabel ? srLabel(value) : value == null ? 'Нет оценки' : `${value} из ${maxValue}`;

    return (
        <span className="inline-flex gap-1" role="img" aria-label={label}>
            {Array.from({length: maxValue}, (_, i) => i + 1).map((rate) => (
                <span key={rate} className="inline-flex size-6 items-center justify-center">
                    <RateStar variant={value !== null && value >= rate ? 'filled' : 'empty'} />
                </span>
            ))}
        </span>
    );
};
