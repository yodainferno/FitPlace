'use client';

import { useEffect, useId, useRef } from 'react';
import { Clock3, MapPin, UserRound, X } from 'lucide-react';
import {
  getPlaceCategoryLabel,
  PlaceRating,
  type PublishedPlace,
} from '@/src/entities/place';
import cls from './PlacesExplorer.module.css';

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
      className={cls.dialog}
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
      <article className={cls.details}>
        <div className={cls.detailsTop}>
          <span className={cls.category}>
            {getPlaceCategoryLabel(place.category)}
          </span>
          <button
            type="button"
            className={cls.iconButton}
            aria-label="Закрыть карточку места"
            title="Закрыть"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <h2 id={titleId} className={cls.detailsTitle}>
          {place.name}
        </h2>
        <PlaceRating value={place.rate} />
        <p className={cls.description}>
          {place.about?.description || 'Описание пока не добавлено.'}
        </p>
        <dl className={cls.facts}>
          <div>
            <MapPin size={18} aria-hidden="true" />
            <dt>Адрес</dt>
            <dd>{place.location.address}</dd>
          </div>
          <div>
            <Clock3 size={18} aria-hidden="true" />
            <dt>Часы работы</dt>
            <dd>{place.about?.workingHours || 'Не указаны'}</dd>
          </div>
          <div>
            <UserRound size={18} aria-hidden="true" />
            <dt>Автор</dt>
            <dd>{place.user_id || 'Не указан'}</dd>
          </div>
        </dl>
      </article>
    </dialog>
  );
}
