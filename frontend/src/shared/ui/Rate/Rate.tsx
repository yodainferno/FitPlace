import {RateDisplay} from './RateDisplay/RateDisplay';
import {RateEditor} from './RateEditor/RateEditor';

type RateProps = {
    value: number | null;
    maxValue: number;
    editable?: boolean;
    srLabel?: (value: number | null) => string;
    srLegendLabel?: string;
};

export const Rate = ({value, maxValue, editable = false, srLabel, srLegendLabel}: RateProps) => {
    const display = <RateDisplay value={value} maxValue={maxValue} srLabel={srLabel} />;

    return (
        <fieldset className="flex max-w-fit gap-1 rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-amber-600">
            <legend className="sr-only">{srLegendLabel ?? 'Оценка'}</legend>
            {editable ? <RateEditor key={value ?? 'none'} value={value} maxValue={maxValue}>{display}</RateEditor> : display}
        </fieldset>
    );
};
