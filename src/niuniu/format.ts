import {
  LABEL_MAN_NIU,
  LABEL_NIU_PREFIX,
  LABEL_NO_NIU,
  REASON_REMAINING_TWO_LABEL,
  REASON_TRIPLE_LABEL,
  SCORE_MAN_NIU,
} from './constants';
import type { NiuniuResult } from './types';

/** Human-readable result: 满牛/牛N + 倍数, or 没有牛 when no score. */
export function formatResult(r: NiuniuResult): string {
  if (!r.valid) return LABEL_NO_NIU;
  const label =
    r.score === SCORE_MAN_NIU ? LABEL_MAN_NIU : `${LABEL_NIU_PREFIX}${r.score}`;
  return `${label}，倍数 ${r.multiplier}`;
}

const REASON_PREFIX = '原因：';

const FACE_SET = new Set(['J', 'Q', 'K']);
const FACE_SORT_VALUE = 10;

/** 牌面转排序用数字：A/1 为 1，2-10 为自身，J/Q/K 为 10. */
function labelToSortValue(label: string): number {
  const u = label.trim().toUpperCase();
  if (u === 'A') return 1;
  if (FACE_SET.has(u)) return FACE_SORT_VALUE;
  const n = Number(label);
  return Number.isInteger(n) && n >= 1 && n <= 10 ? n : FACE_SORT_VALUE;
}

/** 原因中的牌面按数字升序显示（1…10，J/Q/K 视为 10）. */
function sortLabelsAscending(labels: string[]): string[] {
  return [...labels].sort(
    (a, b) =>
      labelToSortValue(a) - labelToSortValue(b) ||
      String(a).localeCompare(String(b), undefined, { numeric: true })
  );
}

function sortValuesAscending(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

function joinLabels(labels: string[]): string {
  return labels.length > 0 ? `（${sortLabelsAscending(labels).join('、')}）` : '';
}

/** 数字转展示：1 显示为 A. */
function valueToDisplay(v: number): string {
  return v === 1 ? 'A' : String(v);
}

function joinValues(values: number[]): string {
  if (values.length === 0) return '';
  const sorted = sortValuesAscending(values);
  return `（${sorted.map(valueToDisplay).join('、')}）`;
}

/** Format result plus reason: only 三张凑成10的倍数 + 剩余两张 (no other text). */
export function formatResultWithReason(r: NiuniuResult): string {
  if (!r.valid) return formatResult(r);
  const main = formatResult(r);
  const parts: string[] = [];
  if (r.reasonTripleLabels && r.reasonTripleLabels.length === 3) {
    parts.push(`${REASON_TRIPLE_LABEL}${joinLabels(r.reasonTripleLabels)}`);
  } else if (r.reasonTripleValues && r.reasonTripleValues.length === 3) {
    parts.push(`${REASON_TRIPLE_LABEL}${joinValues(r.reasonTripleValues)}`);
  }
  if (r.reasonRemainingLabels && r.reasonRemainingLabels.length > 0) {
    const label =
      r.reasonRemainingLabels.length === 2
        ? REASON_REMAINING_TWO_LABEL
        : '剩余';
    parts.push(`${label}${joinLabels(r.reasonRemainingLabels)}`);
  } else if (r.reasonCardValues && r.reasonCardValues.length > 0) {
    const label =
      r.reasonCardValues.length === 2 ? REASON_REMAINING_TWO_LABEL : '剩余';
    parts.push(`${label}${joinValues(r.reasonCardValues)}`);
  }
  if (parts.length === 0) return main;
  return `${main}\n${REASON_PREFIX}${parts.join('，')}`;
}
