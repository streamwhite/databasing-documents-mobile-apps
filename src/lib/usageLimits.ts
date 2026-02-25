import * as SecureStore from 'expo-secure-store';

type UsageKind = 'extract' | 'query';

interface UsageRecord {
  date: string;
  extract: number;
  query: number;
}

const KEY_USAGE = 'usage_limits_v1';

function todayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function loadUsage(): Promise<UsageRecord | null> {
  try {
    const raw = await SecureStore.getItemAsync(KEY_USAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UsageRecord;
    if (!parsed || typeof parsed.date !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

async function saveUsage(record: UsageRecord): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY_USAGE, JSON.stringify(record));
  } catch {
    // ignore
  }
}

export async function getTodayUsage(): Promise<UsageRecord> {
  const today = todayKey();
  const existing = await loadUsage();
  if (!existing || existing.date !== today) {
    const fresh: UsageRecord = { date: today, extract: 0, query: 0 };
    await saveUsage(fresh);
    return fresh;
  }
  return existing;
}

export async function incrementUsage(kind: UsageKind): Promise<UsageRecord> {
  const today = todayKey();
  const existing = await loadUsage();
  const base: UsageRecord =
    existing && existing.date === today
      ? existing
      : { date: today, extract: 0, query: 0 };
  const next: UsageRecord = {
    ...base,
    [kind]: base[kind] + 1,
  };
  await saveUsage(next);
  return next;
}

export function isOverLimit(
  kind: UsageKind,
  record: UsageRecord,
  limit: number,
): boolean {
  return record[kind] >= limit;
}

