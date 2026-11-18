'use client';

import { useEffect, useId, useRef } from 'react';
import { Clock3, MapPin, UserRound, X } from 'lucide-react';
import {
  getPlaceCategoryLabel,
  PlaceRating,
  type PublishedPlace,
} from '@/src/entities/place';
import { IconButton } from '@/src/shared/ui/IconButton';

type PlaceDetailsDialogProps = {
  place: PublishedPlace;
  onClose: () => void;
};

export function PlaceDetailsDialog({
  place,
  onClose,
}: PlaceDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(35rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-border bg-background p-0 text-foreground shadow-dialog backdrop:bg-foreground/45"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          onClose();
        }
      }}
    >
      <article className="p-5 map:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-primary">
            {getPlaceCategoryLabel(place.category)}
          </span>
          <IconButton label="Закрыть карточку места" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </IconButton>
        </div>
        <h2
          id={titleId}
          className="mb-3.5 text-[21px] leading-[1.3] font-semibold wrap-anywhere map:text-2xl"
        >
          {place.name}
        </h2>
        <PlaceRating value={place.rate} />
        <p className="my-6 text-sm leading-[1.7] text-muted-foreground wrap-anywhere">
          {place.about?.description || 'Описание пока не добавлено.'}
        </p>
        <dl className="grid gap-4.5 border-t border-border pt-5">
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1">
            <MapPin
              size={18}
              className="row-span-2 mt-0.5 text-primary"
              aria-hidden="true"
            />
            <dt className="text-[11px] text-muted-foreground">Адрес</dt>
            <dd className="text-[13px] leading-relaxed wrap-anywhere">
              {place.location.address}
            </dd>
          </div>
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1">
            <Clock3
              size={18}
              className="row-span-2 mt-0.5 text-primary"
              aria-hidden="true"
            />
            <dt className="text-[11px] text-muted-foreground">Часы работы</dt>
            <dd className="text-[13px] leading-relaxed wrap-anywhere">
              {place.about?.workingHours || 'Не указаны'}
            </dd>
          </div>
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1">
            <UserRound
              size={18}
              className="row-span-2 mt-0.5 text-primary"
              aria-hidden="true"
            />
            <dt className="text-[11px] text-muted-foreground">Автор</dt>
            <dd className="text-[13px] leading-relaxed wrap-anywhere">
              {place.user_id || 'Не указан'}
            </dd>
          </div>
        </dl>
      </article>
    </dialog>
  );
}
