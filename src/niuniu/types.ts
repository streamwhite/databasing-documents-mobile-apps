/** Single card: face (J/Q/K) or number 1–10. */
export interface Card {
  readonly face: boolean;
  readonly value: number;
}

/** Parsed hand of exactly HAND_SIZE cards. */
export interface Hand {
  readonly cards: readonly Card[];
  readonly faceCount: number;
  readonly numbers: readonly number[];
}

/** Result of the calculator. */
export interface NiuniuResult {
  readonly score: number;
  readonly multiplier: number;
  readonly label: string;
  readonly valid: boolean;
  /** Why there is a score (e.g. 3张花牌 / 3张数字和%10=0); only when valid. */
  readonly reasonSummary?: string;
  /** The 3 cards that sum to a multiple of 10 (凑成10的倍数); when applicable. */
  readonly reasonTripleValues?: number[];
  /** Remaining card values (剩余两张 or 剩余1张); when applicable. */
  readonly reasonCardValues?: number[];
  /** Display labels for triple (e.g. J,Q,K not 10,10,10); when applicable. */
  readonly reasonTripleLabels?: string[];
  /** Display labels for remaining cards; when applicable. */
  readonly reasonRemainingLabels?: string[];
}
