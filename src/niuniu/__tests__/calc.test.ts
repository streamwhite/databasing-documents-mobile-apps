import {
  REASON_0_FACE,
  REASON_1_FACE,
  REASON_2_FACE,
  REASON_3_FACE,
  REASON_4_FACE,
  REASON_5_FACE,
} from '../constants';
import { calculate, formatResultWithReason } from '../index';

function hand(...cards: string[]): string[] {
  return cards;
}

describe('niuniu calculator', () => {
  describe('5张花牌', () => {
    it('5 face cards -> 满牛, multiplier 5, reason 5张花牌', () => {
      const r = calculate(hand('J', 'Q', 'K', 'J', 'Q'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(10);
      expect(r.multiplier).toBe(5);
      expect(r.label).toBe('满牛');
      expect(r.reasonSummary).toBe(REASON_5_FACE);
      expect(r.reasonCardValues).toBeUndefined();
      expect(formatResultWithReason(r)).toContain('满牛');
      expect(formatResultWithReason(r)).toBe('满牛，倍数 5');
    });
  });

  describe('4张花牌', () => {
    it('4 face + 1 number (not 10) -> 牛7, multiplier 2 (score 7), reason lists remaining', () => {
      const r = calculate(hand('J', 'Q', 'K', 'J', '7'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(7);
      expect(r.multiplier).toBe(2);
      expect(r.label).toBe('牛7');
      expect(r.reasonSummary).toBe(REASON_4_FACE);
      expect(r.reasonCardValues).toEqual([7]);
    });
    it('4 face + 10 -> 满牛, multiplier 4', () => {
      const r = calculate(hand('J', 'Q', 'K', 'J', '10'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(10);
      expect(r.multiplier).toBe(4);
      expect(r.label).toBe('满牛');
      expect(r.reasonCardValues).toEqual([10]);
    });
    it('4 face + number 1-6 -> 牛N, multiplier 1 (有牛且倍数 1)', () => {
      const r = calculate(hand('J', 'Q', 'K', 'J', '3'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(3);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛3');
    });
  });

  describe('3张花牌', () => {
    it('3 face + 2 numbers sum%10=0 -> 满牛, multiplier 3, reason lists 2 numbers', () => {
      const r = calculate(hand('J', 'Q', 'K', '3', '7'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(10);
      expect(r.multiplier).toBe(3);
      expect(r.reasonSummary).toBe(REASON_3_FACE);
      expect(r.reasonCardValues).toEqual([3, 7]);
    });
    it('3 face + 2 numbers sum%10!=0 -> 牛7, multiplier 2 (score 7)', () => {
      const r = calculate(hand('J', 'Q', 'K', '2', '5'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(7);
      expect(r.multiplier).toBe(2);
      expect(r.label).toBe('牛7');
      expect(r.reasonCardValues).toEqual([2, 5]);
    });
    it('3 face + 2 numbers sum%10 in 1-6 -> 牛N, multiplier 1 (有牛且倍数 1)', () => {
      const r = calculate(hand('J', 'Q', 'K', '1', '2'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(3);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛3');
      expect(r.reasonCardValues).toEqual([1, 2]);
    });
  });

  describe('2张花牌', () => {
    it('2 face + 3 numbers, 任三张和%10=0 -> 满牛, multiplier 3, reason lists 剩余2张', () => {
      const r = calculate(hand('J', 'Q', '3', '7', '10'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(10);
      expect(r.multiplier).toBe(3);
      expect(r.reasonSummary).toBe(REASON_2_FACE);
      expect(r.reasonCardValues).toHaveLength(2);
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([3, 7]));
    });
    it('2 face 有牛且倍数 1 -> 牛3, 剩余两张和%10=3', () => {
      const r = calculate(hand('J', 'Q', '10', '1', '2'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(3);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛3');
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([1, 2]));
    });
    it('2 face 2倍: 牛7', () => {
      const r = calculate(hand('J', 'Q', '10', '2', '5'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(7);
      expect(r.multiplier).toBe(2);
      expect(r.label).toBe('牛7');
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([2, 5]));
    });
    it('2 face + 3 numbers sum%10!=0 -> 没有牛', () => {
      const r = calculate(hand('J', 'Q', '1', '2', '3'));
      expect(r.valid).toBe(false);
      expect(r.label).toBe('');
      expect(formatResultWithReason(r)).toBe('没有牛');
    });
  });

  describe('1张花牌', () => {
    it('1 face + 4 numbers, 任三张和%10=0, 剩余两张和%10=3 -> 牛3, multiplier 1', () => {
      const r = calculate(hand('Q', '9', '7', '4', '3'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(3);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛3');
      expect(r.reasonSummary).toBe(REASON_1_FACE);
      expect(r.reasonCardValues).toHaveLength(2);
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([9, 4]));
    });
    it('1 face 满牛: 剩余两张和%10=0', () => {
      const r = calculate(hand('Q', '3', '7', '5', '5'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(10);
      expect(r.multiplier).toBe(3);
      expect(r.label).toBe('满牛');
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([5, 5]));
    });
    it('1 face 2倍: 牛7', () => {
      const r = calculate(hand('Q', '2', '5', '3', '7'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(7);
      expect(r.multiplier).toBe(2);
      expect(r.label).toBe('牛7');
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([2, 5]));
    });
    it('1 face + 4 numbers, no triple sum%10=0 -> 没有牛', () => {
      const r = calculate(hand('Q', '1', '2', '3', '4'));
      expect(r.valid).toBe(false);
    });
  });

  describe('5张数字牌', () => {
    it('5 numbers, 3 sum%10=0, other 2 sum%10=9 -> 牛9, multiplier 2', () => {
      const r = calculate(hand('9', '7', '4', '3', '6'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(9);
      expect(r.multiplier).toBe(2);
      expect(r.label).toBe('牛9');
      expect(r.reasonSummary).toBe(REASON_0_FACE);
      expect(r.reasonTripleValues).toHaveLength(3);
      expect(r.reasonCardValues).toHaveLength(2);
    });
    it('5 numbers, 3 sum%10=0, other 2 sum%10=0 -> 满牛, multiplier 3', () => {
      const r = calculate(hand('10', '9', '1', '5', '5'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(10);
      expect(r.multiplier).toBe(3);
      expect(r.label).toBe('满牛');
    });
    it('5 numbers 有牛且倍数 1 -> 牛4', () => {
      const r = calculate(hand('1', '4', '5', '2', '2'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(4);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛4');
      expect(r.reasonCardValues).toEqual(expect.arrayContaining([2, 2]));
    });
    it('5 numbers, no triple sum%10=0 -> 没有牛', () => {
      const r = calculate(hand('1', '1', '2', '2', '2'));
      expect(r.valid).toBe(false);
      expect(formatResultWithReason(r)).toBe('没有牛');
    });
  });

  describe('倍数 by score', () => {
    it('score 7/8/9 -> multiplier 2', () => {
      const r = calculate(hand('J', 'Q', 'K', '2', '5'));
      expect(r.score).toBe(7);
      expect(r.multiplier).toBe(2);
      const r9 = calculate(hand('9', '7', '4', '3', '6'));
      expect(r9.score).toBe(9);
      expect(r9.multiplier).toBe(2);
    });
    it('score 1-6 -> multiplier 1', () => {
      const r = calculate(hand('Q', '9', '7', '4', '3'));
      expect(r.score).toBe(3);
      expect(r.multiplier).toBe(1);
    });
  });

  describe('有牛且倍数为1', () => {
    it('牛1: 5张数字 三张和%10=0 余二和%10=1', () => {
      const r = calculate(hand('2', '4', '4', '1', '10'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(1);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛1');
    });
    it('牛2: 5张数字 余二和=2', () => {
      const r = calculate(hand('5', '3', '2', '1', '1'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(2);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛2');
    });
    it('牛3: 1张花牌 + 4数字 (已有)', () => {
      const r = calculate(hand('Q', '9', '7', '4', '3'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(3);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛3');
    });
    it('牛4: 5张数字 余二和=4', () => {
      const r = calculate(hand('1', '4', '5', '2', '2'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(4);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛4');
    });
    it('牛5: 5张数字 余二和=5', () => {
      const r = calculate(hand('2', '3', '5', '1', '4'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(5);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛5');
    });
    it('牛6: 5张数字 余二和=6', () => {
      const r = calculate(hand('2', '3', '5', '1', '5'));
      expect(r.valid).toBe(true);
      expect(r.score).toBe(6);
      expect(r.multiplier).toBe(1);
      expect(r.label).toBe('牛6');
    });
  });

  describe('output format', () => {
    it('valid: only 三张凑成10的倍数 + 剩余两张 in reason (no other text)', () => {
      const r = calculate(hand('J', 'Q', 'K', '3', '7'));
      const out = formatResultWithReason(r);
      expect(out).toMatch(/满牛，倍数 3/);
      expect(out).toContain('原因：');
      expect(out).toContain('三张凑成10的倍数');
      expect(out).toContain('剩余两张');
      expect(out).toContain('3');
      expect(out).toContain('7');
      expect(out).not.toContain('3张花牌');
    });
    it('reason shows original face labels J/Q/K not 10', () => {
      const r = calculate(hand('J', 'Q', 'K', '3', '7'));
      expect(r.reasonTripleLabels).toEqual(['J', 'Q', 'K']);
      expect(r.reasonRemainingLabels).toEqual(['3', '7']);
      const out = formatResultWithReason(r);
      expect(out).toContain('J');
      expect(out).toContain('Q');
      expect(out).toContain('K');
      expect(out).not.toMatch(/10、10、10/);
    });
    it('invalid: 没有牛', () => {
      expect(
        formatResultWithReason(calculate(hand('1', '1', '2', '2', '2'))),
      ).toBe('没有牛');
    });
  });
});
