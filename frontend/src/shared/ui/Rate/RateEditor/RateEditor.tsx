'use client';

import { lazy, Suspense, useState, type ReactNode } from 'react';
import { Pencil, X } from 'lucide-react';

const RateInput = lazy(() =>
  import('../RateInput/RateInput').then((module) => ({
    default: module.RateInput,
  })),
);

type RateEditorProps = {
  value: number | null;
  maxValue: number;
  children: ReactNode;
};

export const RateEditor = ({ value, maxValue, children }: RateEditorProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number | null>(value);

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <span className="flex flex-col gap-2">
      <button
        type="button"
        className="inline-flex size-6 items-center justify-center rounded-sm hover:bg-amber-100"
        aria-label={editing ? 'Отменить изменение оценки' : 'Изменить оценку'}
        title={editing ? 'Отменить изменение оценки' : 'Изменить оценку'}
        onClick={editing ? cancel : () => setEditing(true)}
      >
        {editing ? <X size={16} /> : <Pencil size={16} />}
      </button>
      {editing ? (
        <Suspense fallback={children}>
          <RateInput value={draft} maxValue={maxValue} onChange={setDraft} />
        </Suspense>
      ) : (
        children
      )}
    </span>
  );
};
