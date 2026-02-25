# Pre-APK build checklist

Use this before running `eas build --profile production-apk` (or `production` for AAB).

---

## 1. Environment & secrets

| Check | Where | Notes |
|-------|--------|--------|
| **API base URL** | `eas.json` → `build["production-apk"].env.EXPO_PUBLIC_API_BASE_URL` | Already set to `https://ddapi.piaosiyuan.cn` for production-apk. |
| **API key** | EAS Secrets or `eas.json` env | If production uses a different key, set `EXPO_PUBLIC_API_KEY` in EAS Secrets (or in build env). App fallback is in code; prefer secret for production. |
| **Mobile tenant id** | Optional | `EXPO_PUBLIC_MOBILE_TENANT_ID` only if you override the no-login tenant for this build. |

**Set a secret (once):**
```bash
eas secret:create --name EXPO_PUBLIC_API_KEY --value "your-production-key" --scope project
```

---

## 2. App identity & version

| Check | Where |
|-------|--------|
| **Version** | `app.json` → `expo.version` (e.g. 1.0.0). Bump if releasing a new store version. |
| **Android package** | `app.json` → `expo.android.package` (`com.herwidget.databasingdocuments`). |
| **App name / icon / splash** | `app.json` + `./assets/` (icon, splash, adaptive-icon). |

---

## 3. Code & quality

| Check | Command / action |
|-------|-------------------|
| **Lint** | `pnpm run lint` (if script exists) or run your linter. |
| **Tests** | `pnpm test` — fix failing tests. |
| **No localhost in build** | EAS build uses `eas.json` env; no `.env` from your machine. Confirm no hardcoded `localhost` or dev URLs in code paths used in production. |

---

## 4. Build profile

| Check | Where |
|-------|--------|
| **Profile** | `eas.json` → `build["production-apk"]`: `android.buildType: "apk"`, `env.EXPO_PUBLIC_API_BASE_URL` set. |
| **EAS project** | `app.json` → `extra.eas.projectId` matches your EAS project. |

---

## 5. Quick commands

```bash
# Build APK (after checks above)
eas build --profile production-apk --platform android

# Optional: validate config first
eas build:configure
```

---

## 6. Download build (APK)

After a build completes, download the artifact with EAS CLI:

```bash
# Download latest Android build (APK or AAB) to current directory
eas build:download --platform android --latest

# Download to a specific path
eas build:download --platform android --latest --output ./databasing-documents.apk

# Download a specific build by ID (from dashboard or eas build:list)
eas build:download --id <BUILD_ID>

# List recent builds (to get build IDs)
eas build:list --platform android --limit 5
```

---

## Summary

1. Confirm **API base URL** and **API key** (and optional tenant id) for production.
2. Bump **version** in app.json if this is a new release.
3. Run **lint** and **tests**.
4. Run **eas build --profile production-apk --platform android**.
