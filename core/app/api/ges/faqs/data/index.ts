import { eac } from './eac';
import { electrical } from './electrical';
import { exhibitSystem } from './exhibit-system';
import { flooring } from './flooring';
import { general } from './general';
import { gesLogistics } from './ges-logistics';
import { hangingSign } from './hanging-sign';
import { materialHandling } from './material-handling';
import { ordersPayments } from './orders-payments';
import { plumbing } from './plumbing';
import { priority } from './priority';
import type { FaqCategoryFile } from './types';

// Add or remove entries here to control which categories appear on the FAQ page.
// Each file owns its own category metadata + question list, so content edits
// stay isolated to a single file.
export const FAQ_CATEGORY_FILES: FaqCategoryFile[] = [
  general,
  materialHandling,
  exhibitSystem,
  flooring,
  priority,
  gesLogistics,
  electrical,
  hangingSign,
  plumbing,
  eac,
  ordersPayments,
];
