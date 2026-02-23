import { MOD_BASE } from './constants';

/** Find first triple of indices whose values sum to multiple of MOD_BASE. */
export function findTripleSumMod10(arr: readonly number[]): [number, number, number] | null {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const sum = (arr[i]! + arr[j]! + arr[k]!) % MOD_BASE;
        if (sum === 0) return [i, j, k];
      }
    }
  }
  return null;
}

/** Sum of elements at indices not in [i, j, k]. */
export function sumExcluding(
  arr: readonly number[],
  i: number,
  j: number,
  k: number
): number {
  let s = 0;
  const skip = new Set([i, j, k]);
  for (let idx = 0; idx < arr.length; idx++) {
    if (!skip.has(idx)) s += arr[idx]!;
  }
  return s;
}

/** Single value excluding indices i,j,k (one remaining). */
export function valueExcluding(
  arr: readonly number[],
  i: number,
  j: number,
  k: number
): number | null {
  const out: number[] = [];
  const skip = new Set([i, j, k]);
  for (let idx = 0; idx < arr.length; idx++) {
    if (!skip.has(idx)) out.push(arr[idx]!);
  }
  return out.length === 1 ? out[0]! : null;
}

/** Values at given indices. */
export function valuesAt(arr: readonly number[], indices: [number, number, number]): number[] {
  return [arr[indices[0]]!, arr[indices[1]]!, arr[indices[2]]!];
}

/** Values at indices not in [i, j, k]. */
export function remainingValues(
  arr: readonly number[],
  i: number,
  j: number,
  k: number
): number[] {
  const out: number[] = [];
  const skip = new Set([i, j, k]);
  for (let idx = 0; idx < arr.length; idx++) {
    if (!skip.has(idx)) out.push(arr[idx]!);
  }
  return out;
}

/** Indices not in [i, j, k], in order. */
export function remainingIndices(
  i: number,
  j: number,
  k: number,
  length: number
): number[] {
  const out: number[] = [];
  const skip = new Set([i, j, k]);
  for (let idx = 0; idx < length; idx++) {
    if (!skip.has(idx)) out.push(idx);
  }
  return out;
}
