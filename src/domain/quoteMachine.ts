/** Pure quote RFP state transitions — reusable in React Native */

import type { QuoteStatus } from './types';

const transitions: Record<QuoteStatus, QuoteStatus[]> = {
  new: ['responded', 'lost'],
  responded: ['won', 'lost'],
  won: [],
  lost: [],
};

export function canQuoteTransition(from: QuoteStatus, to: QuoteStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}
