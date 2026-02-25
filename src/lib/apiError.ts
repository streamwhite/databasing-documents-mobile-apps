import { MSG_DEVICE_DAILY_LIMIT } from '../app-config';

const HTTP_TOO_MANY_REQUESTS = 429;
const RESPONSE_DETAIL_KEY = 'detail';
const DETAIL_ERROR_CODE_KEY = 'error_code';
const MOBILE_DEVICE_LIMIT_EXCEEDED = 'MOBILE_DEVICE_LIMIT_EXCEEDED';

function isDetailWithErrorCode(
  d: unknown,
): d is Record<string, unknown> & { error_code: string } {
  return (
    d !== null &&
    typeof d === 'object' &&
    typeof (d as Record<string, unknown>)[DETAIL_ERROR_CODE_KEY] === 'string'
  );
}

/**
 * For 429 with detail.error_code === MOBILE_DEVICE_LIMIT_EXCEEDED, return Chinese notice. Else use detail string or body text.
 */
export function getErrorFromResponse(status: number, text: string): string {
  if (status === HTTP_TOO_MANY_REQUESTS && text) {
    try {
      const body = JSON.parse(text) as Record<string, unknown>;
      const detail = body[RESPONSE_DETAIL_KEY];
      if (isDetailWithErrorCode(detail) && detail[DETAIL_ERROR_CODE_KEY] === MOBILE_DEVICE_LIMIT_EXCEEDED) {
        return MSG_DEVICE_DAILY_LIMIT;
      }
      if (typeof detail === 'string' && detail) return detail;
      if (detail && typeof detail === 'object' && typeof (detail as Record<string, unknown>).message === 'string') {
        return (detail as Record<string, unknown>).message as string;
      }
    } catch {
      // use text below
    }
  }
  return text || 'Request failed';
}
