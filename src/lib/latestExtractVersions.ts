const MAX_LATEST_EXTRACT_VERSION_IDS = 5;

/** In-memory store of document_version_ids from the latest extract (for no-login query scoping). */
let latestIds: number[] = [];

export function setLatestExtractDocumentVersionIds(ids: number[]): void {
  const arr = Array.isArray(ids) ? ids : [];
  latestIds = arr.slice(0, MAX_LATEST_EXTRACT_VERSION_IDS);
}

export function getLatestExtractDocumentVersionIds(): number[] {
  return [...latestIds];
}
