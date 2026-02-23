import type { NiuniuResult } from './types';
import { LABEL_MAN_NIU, LABEL_NIU_PREFIX, SCORE_MAN_NIU } from './constants';
import { parseHand } from './parse';
import { computeScore, finalMultiplier } from './score';

function toLabel(score: number): string {
  return score === SCORE_MAN_NIU ? LABEL_MAN_NIU : `${LABEL_NIU_PREFIX}${score}`;
}

/** Run calculator on 5 card inputs. */
export function calculate(inputs: readonly string[]): NiuniuResult {
  const hand = parseHand(inputs);
  if (hand === null) {
    return { score: 0, multiplier: 0, label: '', valid: false };
  }
  const {
    score,
    caseMultiplier,
    valid,
    reasonSummary,
    reasonTripleValues,
    reasonCardValues,
    reasonTripleIndices,
    reasonRemainingIndices,
  } = computeScore(hand);
  if (!valid) {
    return { score: 0, multiplier: 0, label: '', valid: false };
  }
  const multiplier = finalMultiplier(score, caseMultiplier);
  const label = toLabel(score);
  const reasonTripleLabels =
    reasonTripleIndices?.map((i) => inputs[i] ?? String(hand.cards[i]?.value ?? ''));
  const reasonRemainingLabels =
    reasonRemainingIndices?.map((i) => inputs[i] ?? String(hand.cards[i]?.value ?? ''));
  return {
    score,
    multiplier,
    label,
    valid: true,
    reasonSummary,
    reasonTripleValues,
    reasonCardValues,
    reasonTripleLabels: reasonTripleLabels?.length ? reasonTripleLabels : undefined,
    reasonRemainingLabels: reasonRemainingLabels?.length ? reasonRemainingLabels : undefined,
  };
}
