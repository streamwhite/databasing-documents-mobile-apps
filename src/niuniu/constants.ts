/** Face card labels (花牌). */
export const FACE_LABELS = ['J', 'Q', 'K'] as const;

/** Numeric value of face cards for sum/mod10. */
export const FACE_NUMERIC_VALUE = 10;

/** Valid number range (1-10). */
export const MIN_NUM = 1;
export const MAX_NUM = 10;

/** Hand size. */
export const HAND_SIZE = 5;

/** Modulo base for "牛" combos. */
export const MOD_BASE = 10;

/** Multipliers by scenario. */
export const MULT_5_FACE = 5;
export const MULT_4_FACE = 4;
export const MULT_3_FACE = 3;

/** Multipliers by final score. */
export const MULT_SCORE_7_8_9 = 2;
export const MULT_SCORE_1_6 = 1;

/** Score for "满牛". */
export const SCORE_MAN_NIU = 10;

/** Output labels. */
export const LABEL_MAN_NIU = '满牛';
export const LABEL_NIU_PREFIX = '牛';
/** When score is null (no 牛). */
export const LABEL_NO_NIU = '没有牛';

/** Reason copy. */
export const REASON_TRIPLE_LABEL = '三张凑成10的倍数';
export const REASON_REMAINING_TWO_LABEL = '剩余两张';
export const REASON_5_FACE = '5张花牌';
export const REASON_4_FACE = '4张花牌，剩余1张数字牌';
export const REASON_3_FACE = '3张花牌(当10)，任三张和%10=0，剩余两张和%10';
export const REASON_2_FACE = '2张花牌(当10)，任三张和%10=0，剩余两张和%10';
export const REASON_1_FACE = '1张花牌(当10)，任三张和%10=0，剩余两张和%10';
export const REASON_0_FACE = '5张数字牌，3张和%10=0，剩余2张';
