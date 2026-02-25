# Limited access for mobile app (extract & query)

Concise description of two solutions: (1) limit the **number of times per day** a user can use extract and query, and (2) allow extract/query without login for the mobile app only (backend still requires login for web).

---

## 1. Limit number of extract/query uses per day

**Goal:** Each user may use extract and query only a fixed number of times per day (e.g. 5 each). Counts reset at midnight (device local date).

### Implemented in this app (mobile-only)

| What | Where |
|------|--------|
| **Storage** | `src/lib/usageLimits.ts`: daily record `{ date, extract, query }` in SecureStore; date key is `YYYY-MM-DD` (local). |
| **Config** | `src/app-config.ts`: `USAGE_DAILY_LIMIT` (e.g. 5), `MSG_USAGE_EXTRACT_LIMIT`, `MSG_USAGE_QUERY_LIMIT`. |
| **Extract** | `DocumentUploadSection`: before calling API, `getTodayUsage()` + `isOverLimit('extract', usage, USAGE_DAILY_LIMIT)` → show toast and return; after **successful** extract, `incrementUsage('extract')`. |
| **Query** | `QuerySection`: same pattern for `query` (check limit before send, increment after success). |

Limits are enforced **only in the app**; the backend does not track or enforce them. To enforce server-side, the backend would need to count by user (or by `x-api-key` / device) per calendar day and return 429 when over limit.

**How to count when there is no login:** There is no “user” identity on extract/query if the app calls them without `Authorization`. The backend can only count by something it can see on the request:

| What to count by | How | Limitation |
|------------------|-----|------------|
| **x-api-key** | One daily counter per API key. Increment on each extract/query for that key; 429 when over limit. | All app instances sharing the same key share one limit (coarse). |
| **Device** | App sends a stable `X-Device-Id` (or similar) header—e.g. a UUID generated once and stored on device (SecureStore). Backend counts per `(x-api-key, X-Device-Id, date)`. | User can clear app data to get a new id and effectively reset; optional attestation (Play Integrity / App Attest) can make device id harder to spoof. |
| **User (if logged in)** | When the app sometimes sends `Authorization: Bearer <token>`, backend can count by decoded user id per date. | Only works for requests that include a login token; not applicable for “no login” extract/query. |

So “count by user” without login really means: count by **x-api-key** (one bucket per key) or by **device** (app-provided `X-Device-Id` + key). Choose key-only for simplicity, or key+device for per-device limits.

**Summary**

- **By x-api-key:** One daily counter per API key. Simple, but every app instance using that key shares the same limit.
- **By device:** App sends a stable `X-Device-Id` (e.g. UUID in SecureStore). Backend counts per `(x-api-key, X-Device-Id, date)` so each device has its own limit. Users can still clear app data and get a new id; attestation (Play Integrity / App Attest) can harden this.
- **By user:** Only possible when the request includes `Authorization: Bearer <token>`; not applicable for no-login extract/query.

So "count by user" when there's no login really means: count by **x-api-key** (single shared limit) or by **device** (per-device limit via `X-Device-Id`).

---

## 2. Allow extract/query without login for mobile app only

**Goal:** Backend requires login for web app, but for this mobile app only, extract and query should work without login (e.g. with only `x-api-key`). Other endpoints (and web app) still require `Authorization: Bearer <token>`.

### Approach: client identifier header

1. **Mobile app**  
   - For requests to **extract** and **query** only, send a fixed header that identifies the mobile client, e.g.:
     - `X-Client: mobile`  
     - or `X-App-Id: databasing-documents-mobile-apps`
   - Continue sending `x-api-key` on all requests.  
   - Do **not** send `Authorization` for extract/query when you want “no login” behavior (or send the header only when calling a dedicated “mobile” endpoint if the backend has one).

2. **Backend**  
   - For `POST /documents/extract` and `POST /query` only:
     - If the request includes the agreed client header (e.g. `X-Client: mobile`) **and** a valid `x-api-key`, then **skip** the usual login check (do not require `Authorization`).
     - Otherwise, require `Authorization: Bearer <token>` as today (for web and other clients).
   - All other endpoints (auth, tenants, etc.) unchanged: keep requiring login where they do today.

### Tenant for no-login extract/query

- When the app calls `POST /auth/mobile-token`, it sends **`tenant_id`** in the request body. The backend issues a token scoped to that tenant; subsequent extract/query requests (with that token, no login) access **that tenant’s data**.
- So all no-login mobile extract/query data goes to a single fixed tenant (e.g. for mobile testing). The tenant id is configured in the app (`MOBILE_NO_LOGIN_TENANT_ID` in `src/lib/api-config.ts`; override via `EXPO_PUBLIC_MOBILE_TENANT_ID`). Keep the value secure (do not commit production ids in public docs).
- If the user is **logged in**, other flows (auth, tenants, profile, etc.) still use the user’s own tenant. Extract/query in this app currently always use the no-login flow (mobile token + fixed tenant). If you later add “logged-in extract/query,” the backend would use the tenant from the user’s token for those requests.

### Security notes

- **x-api-key:** Keep required for extract/query so only clients that know the key can call them.
- **Header spoofing:** Any client that sends `X-Client: mobile` and the correct `x-api-key` can call extract/query without login. Treat this as “mobile app has a shared key, no per-user auth for these two actions.” If you need stricter control, add a mobile-specific secret (e.g. second header or signed token) instead of or in addition to the header.
- **Rate limiting:** Prefer rate limiting by IP or by `x-api-key` for extract/query to avoid abuse.

**Examples (header spoofing / stricter control)**

- *Spoofing (any client with the key):*
  ```bash
  curl -X POST "https://api.example.com/query" \
    -H "x-api-key: YOUR_API_KEY" \
    -H "X-Client: mobile" \
    -H "Content-Type: application/json" \
    -d '{"query":"some query"}'
  ```
  Same for `/documents/extract` with form-data. Anyone who knows `x-api-key` can do this; accept as “shared key for mobile” or use a stricter option below.

- *Stricter: second header (mobile-only secret):* Backend and app share a secret; allow no-login extract/query only when both `X-Client: mobile` and e.g. `X-Mobile-Secret: <secret>` are present and valid. Spoofing then requires both the API key and the mobile secret.

- *Stricter: signed token:* App sends e.g. `X-Mobile-Token: <base64(signature)>` where `signature = HMAC-SHA256(secret, timestamp + "|" + nonce)` and optionally `X-Mobile-Timestamp` / `X-Mobile-Nonce`. Backend verifies signature and optional replay window (e.g. timestamp within 5 min). Harder to spoof and adds replay protection.

  **Keeping the signing secret unknown:** Do **not** put the HMAC secret in the app (anything in the app binary or env like `EXPO_PUBLIC_*` can be extracted by reverse engineering). Keep the secret **only on the server** and use a token-issuing flow:

  1. Backend exposes e.g. `POST /auth/mobile-token` (protected by `x-api-key` and optionally rate limited). It does **not** return the secret; it generates `timestamp`, `nonce`, computes `signature = HMAC-SHA256(secret, timestamp + "|" + nonce)` and returns `{ token: base64(signature), timestamp, nonce }` (or a single packed string).
  2. App calls this endpoint when it needs to call extract/query, then sends the returned token (and optional timestamp/nonce) in `X-Mobile-Token` (and optional headers) on extract/query requests.
  3. Backend verifies the token with the same server-held secret. Only the server that issued the token can create or verify it; the app never sees the secret.

  An attacker with only `x-api-key` can still request tokens and call extract/query, but cannot forge tokens without the server. To restrict who can get tokens, protect `/auth/mobile-token` further (e.g. require a separate mobile client secret, or later: device attestation / certificate pinning).

### Summary

| Layer | Change |
|-------|--------|
| **Mobile app** | Add `X-Client: mobile` (or chosen header) on extract and query requests; call extract/query without attaching a login token when you want “no login” behavior. |
| **Backend** | For `/documents/extract` and `/query`, if client header + valid `x-api-key` → allow without `Authorization`; else require `Authorization`. |

This gives you “extract and query without login for this mobile app only” while keeping login required for the web app and other endpoints.
