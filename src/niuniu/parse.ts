import type { Card, Hand } from './types';
import {
  FACE_LABELS,
  FACE_NUMERIC_VALUE,
  HAND_SIZE,
  MAX_NUM,
  MIN_NUM,
} from './constants';

const FACE_SET = new Set(FACE_LABELS.map((s) => s.toUpperCase()));
const ACE_LABEL = 'A';

function parseOne(raw: string): Card | null {
  const s = raw.trim().toUpperCase();
  if (FACE_SET.has(s)) {
    return { face: true, value: FACE_NUMERIC_VALUE };
  }
  if (s === ACE_LABEL) return { face: false, value: 1 };
  const n = Number(s);
  if (Number.isInteger(n) && n >= MIN_NUM && n <= MAX_NUM) return { face: false, value: n };
  return null;
}

/** Parse 5 card inputs into Hand. Returns null if invalid. */
export function parseHand(inputs: readonly string[]): Hand | null {
  if (inputs.length !== HAND_SIZE) return null;
  const cards: Card[] = [];
  for (let i = 0; i < HAND_SIZE; i++) {
    const c = parseOne(inputs[i] ?? '');
    if (c === null) return null;
    cards.push(c);
  }
  const faceCount = cards.filter((c) => c.face).length;
  const numbers = cards.filter((c) => !c.face).map((c) => c.value);
  return { cards, faceCount, numbers };
}
