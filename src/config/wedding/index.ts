import { couple } from './couple';
import { venue } from './venue';

export const weddingData = {
  ...couple,
  wedding: venue,
} as const;
