import type { Hand } from './types';
import {
  MOD_BASE,
  MULT_3_FACE,
  MULT_4_FACE,
  MULT_5_FACE,
  MULT_SCORE_1_6,
  MULT_SCORE_7_8_9,
  REASON_0_FACE,
  REASON_1_FACE,
  REASON_2_FACE,
  REASON_3_FACE,
  REASON_4_FACE,
  REASON_5_FACE,
  SCORE_MAN_NIU,
} from './constants';
import {
  findTripleSumMod10,
  remainingIndices,
  remainingValues,
  sumExcluding,
  valuesAt,
} from './combos';

export interface ScoreResult {
  score: number;
  caseMultiplier: number;
  valid: boolean;
  reasonSummary?: string;
  reasonTripleValues?: number[];
  reasonCardValues?: number[];
  /** Indices into the 5 cards for triple (for original-label display). */
  reasonTripleIndices?: [number, number, number];
  /** Indices into the 5 cards for remaining (for original-label display). */
  reasonRemainingIndices?: number[];
}

function normScore(s: number): number {
  return s % MOD_BASE === 0 ? SCORE_MAN_NIU : s % MOD_BASE;
}

function score5Face(): ScoreResult {
  return {
    score: SCORE_MAN_NIU,
    caseMultiplier: MULT_5_FACE,
    valid: true,
    reasonSummary: REASON_5_FACE,
  };
}

function score4Face(hand: Hand): ScoreResult {
  const [n] = hand.numbers;
  if (n === undefined) return { score: 0, caseMultiplier: 0, valid: false };
  const score = n === 10 ? SCORE_MAN_NIU : n;
  const remainingIdx = hand.cards.findIndex((c) => !c.face);
  return {
    score,
    caseMultiplier: MULT_4_FACE,
    valid: true,
    reasonSummary: REASON_4_FACE,
    reasonCardValues: [n],
    reasonRemainingIndices: remainingIdx >= 0 ? [remainingIdx] : undefined,
  };
}

/** 花牌当10，任三张和%10=0 才有分，得分=剩余两张和%10（0当10）. 用于 1/2/3 张花牌. */
function scoreByTripleRemainingTwo(
  hand: Hand,
  reasonSummary: string
): ScoreResult {
  const values = hand.cards.map((c) => c.value);
  if (values.length !== 5) return { score: 0, caseMultiplier: 0, valid: false };
  const triple = findTripleSumMod10(values);
  if (triple === null) return { score: 0, caseMultiplier: 0, valid: false };
  const twoSum = sumExcluding(values, triple[0], triple[1], triple[2]);
  const score = normScore(twoSum);
  const tripleVals = valuesAt(values, triple);
  const remaining = remainingValues(values, triple[0], triple[1], triple[2]);
  const remainingIdx = remainingIndices(triple[0], triple[1], triple[2], values.length);
  return {
    score,
    caseMultiplier: MULT_3_FACE,
    valid: true,
    reasonSummary,
    reasonTripleValues: tripleVals,
    reasonCardValues: remaining,
    reasonTripleIndices: triple,
    reasonRemainingIndices: remainingIdx,
  };
}

function score3Face(hand: Hand): ScoreResult {
  return scoreByTripleRemainingTwo(hand, REASON_3_FACE);
}

function score2Face(hand: Hand): ScoreResult {
  return scoreByTripleRemainingTwo(hand, REASON_2_FACE);
}

function score1Face(hand: Hand): ScoreResult {
  return scoreByTripleRemainingTwo(hand, REASON_1_FACE);
}

function score0Face(hand: Hand): ScoreResult {
  const nums = hand.numbers;
  if (nums.length !== 5) return { score: 0, caseMultiplier: 0, valid: false };
  const triple = findTripleSumMod10(nums);
  if (triple === null) return { score: 0, caseMultiplier: 0, valid: false };
  const twoSum = sumExcluding(nums, triple[0], triple[1], triple[2]);
  const score = normScore(twoSum);
  const tripleVals = valuesAt(nums, triple);
  const remaining = remainingValues(nums, triple[0], triple[1], triple[2]);
  const remainingIdx = remainingIndices(triple[0], triple[1], triple[2], nums.length);
  return {
    score,
    caseMultiplier: MULT_3_FACE,
    valid: true,
    reasonSummary: REASON_0_FACE,
    reasonTripleValues: tripleVals,
    reasonCardValues: remaining,
    reasonTripleIndices: triple,
    reasonRemainingIndices: remainingIdx,
  };
}

/** Compute score and case multiplier from hand. */
export function computeScore(hand: Hand): ScoreResult {
  switch (hand.faceCount) {
    case 5:
      return score5Face();
    case 4:
      return score4Face(hand);
    case 3:
      return score3Face(hand);
    case 2:
      return score2Face(hand);
    case 1:
      return score1Face(hand);
    case 0:
      return score0Face(hand);
    default:
      return { score: 0, caseMultiplier: 0, valid: false };
  }
}

/** Final multiplier: by score tier (7/8/9 → 2, 1–6 → 1) or case mult when score 10. */
export function finalMultiplier(score: number, caseMultiplier: number): number {
  if (score === SCORE_MAN_NIU) return caseMultiplier;
  if (score >= 7 && score <= 9) return MULT_SCORE_7_8_9;
  return MULT_SCORE_1_6;
}
