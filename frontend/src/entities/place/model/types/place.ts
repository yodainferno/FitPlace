type PublishStateDraft = { status: 'DRAFT' };
type PublishStateInReview = { status: 'IN_REVIEW' };
type PublishStateRejected = { status: 'REJECTED'; reason: string };
type PublishStatePublished = { status: 'PUBLISHED' };

export type PublishState =
  | PublishStateDraft
  | PublishStateInReview
  | PublishStateRejected
  | PublishStatePublished;

export type Place = {
  id: string;
  user_id?: string;
  publishState: PublishState;
  //
  category?: string; // todo - пока описание словами, без строго типа
  //
  // todo - пока без фото
  name: string;
  about?: {
    description: string;
    workingHours: string; // todo - пока описание словами, без строго типа
  };
  //
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  //
  rate?: 0 | 1 | 2 | 3;
};
