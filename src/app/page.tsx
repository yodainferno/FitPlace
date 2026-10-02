'use client'

import {useState} from "react";
import {Rate} from "@/src/shared/ui/Rate";

export default function Home() {
  const [rate, setRate] = useState<number>(0);

  const srLabelGenerator = (value: number | null): string => {
      switch (value) {
          case null:
          case 0:
              return 'Нет оценки';
          case 1:
              return '1 звезда — стоит посетить';
          case 2:
              return '2 звезды — стоит изменить маршрут';
          case 3:
              return '3 звезды — стоит поехать ради этого места';
          default:
              return `${value} звёзд`;
      }
  }

  return (
    <div>
      <Rate
        value={rate}
        maxValue={3}
        onChange={(_r) => setRate(_r)}
        srLabel={srLabelGenerator}
        readOnly={false}
        srLegendLabel="Оценка места"
      />
    </div>
  );
}
