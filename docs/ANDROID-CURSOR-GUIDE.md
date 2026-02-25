# Run on Real Android & Debug in Cursor

## Develop on real device only (no emulator)

Use a **physical Android phone**; no emulator needed.

1. **Phone:** Enable **USB debugging** (Settings → About → tap Build number 7× → Developer options → USB debugging). Connect via USB or use the same Wi‑Fi as your computer.
2. **SDK (if needed):** Set `ANDROID_HOME` (see [Android SDK](#android-sdk-android_home) below) if you run `pnpm run android` or see SDK errors.
3. **Start dev server:** In the project root run `pnpm start`.
4. **Open app on phone:** Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) on the phone, then choose one:
   - **Same Wi‑Fi (LAN):** In Expo Go, scan the QR code shown in the terminal.
   - **USB (no Wi‑Fi needed):** Connect the phone with a USB cable. In terminal run `adb reverse tcp:8081 tcp:8081`, then in Expo Go open the project (or tap the dev server link). The phone reaches Metro over USB, so phone and computer do not need to be on the same network.
   - **Different network (tunnel):** If phone and computer are on different Wi‑Fi or you can’t use USB, use a tunnel. Start the dev server with `pnpm start:tunnel` (runs `expo start --tunnel`). Expo will print a tunnel URL and/or QR code; open that URL in Expo Go on the phone. The tunnel forwards Metro over the internet, so it works from any network. Tunnel can be slower than LAN or USB.
5. **Code changes:** Save files; the app on the phone will hot reload (Fast Refresh). Shake the device or press `m` in the Metro terminal for the dev menu (reload, inspector).

You do **not** need Android Studio or an emulator for this workflow. For debugging in Cursor, see [Debug in Cursor](#debug-in-cursor).

## App stuck loading / “No apps connected”

If Expo Go stays on the loading (spinning) screen and the terminal says **“No apps connected”**, the phone is not reaching Metro. Try in this order:

**1. USB (most reliable)**

- Connect the phone with a **USB cable**.
- In a terminal (with the phone connected), run:
  `adb devices`
  (You should see your device. If not, check USB debugging and cable.)
- Then run:
  `adb reverse tcp:8081 tcp:8081`
- **Leave Metro running** (`pnpm start` in another terminal).
- On the phone: open **Expo Go** → **“Enter URL manually”** (or “Connect manually”) → enter:
  `exp://localhost:8081`
  (Over USB, `localhost` on the phone is forwarded to your computer’s 8081.)
- If it still loads forever, try your computer’s LAN IP instead: e.g. `exp://192.168.1.100:8081` (replace with the IP shown when you run `pnpm start`), and ensure the phone is on the same Wi‑Fi only if you use this IP.

**2. Tunnel (different Wi‑Fi or no USB)**

- Stop Metro (Ctrl+C), then run:
  `pnpm start:tunnel`
- Wait until the terminal shows a **tunnel URL** (e.g. `exp://xxx.ngrok.io` or similar).
- On the phone in Expo Go: **Enter URL manually** and paste that exact tunnel URL, or scan the **tunnel** QR code (not the LAN one).
- If the tunnel URL never appears or fails, check your network/firewall; tunnel needs outbound HTTPS.

**3. Same Wi‑Fi (LAN)**

- Phone and computer must be on the **same Wi‑Fi** (not guest network, not different VLAN).
- In Expo Go use **“Enter URL manually”** and type the URL Metro prints, e.g. `exp://192.168.x.x:8081`.
- If it still fails: **firewall** may be blocking 8081. On Linux, allow port 8081 (e.g. `sudo ufw allow 8081` if you use ufw), or temporarily disable the firewall to test.

**4. General**

- Only one Metro process: quit any other `pnpm start` or `expo start` so port 8081 is free.
- Restart Metro with cache clear: `pnpm start -- --clear`, then try connecting again.
- In Expo Go, clear app data or reinstall Expo Go if it’s stuck on an old project.

## Metro & Fast Refresh (keep it running, auto reload)

**Metro fails on partial/incomplete saves:** Metro (and the bundler) re-runs when you save. If you save while the file has invalid syntax (e.g. half-typed code, missing bracket), the build can fail and Metro may show a red error or disconnect. **Workaround:** Prefer saving only when the file is valid, or save again after you finish the edit so Metro gets a valid bundle. If Metro gets stuck, press `r` in the Metro terminal to reload the bundle, or restart with `pnpm start` and, if needed, `pnpm start -- --clear` to clear the cache.

**Auto reload when you save:** Fast Refresh is on by default: saving a `.ts`/`.tsx` file should update the app without pressing `r`. If it doesn’t: (1) Shake the device or press `m` in the Metro terminal → ensure **Fast Refresh** is enabled in the dev menu. (2) Do one manual reload (press `r` or “Reload” in the dev menu); after that, saves should trigger refresh. (3) If you use Expo Go over a slow connection, updates can be delayed—wait a few seconds or reload once. You only need to press `r` when the bundle fails (e.g. after a bad save) or when Fast Refresh doesn’t apply (e.g. some native or config changes).

## Android SDK (ANDROID_HOME)

Expo/React Native needs the Android SDK path when opening on Android (emulator or device). If you see **"Failed to resolve the Android SDK path"**:

1. **Find your SDK path.** Common locations:
   - Android Studio default: `$HOME/Android/Sdk`
   - Android Studio: **Settings → Appearance & Behavior → System Settings → Android SDK** → “Android SDK location”.
2. **Set for this terminal:**
   `export ANDROID_HOME=/path/to/your/Android/Sdk`
   (Use your actual path, e.g. `export ANDROID_HOME=$HOME/Android/Sdk`.)
3. **Optional:** Add the same `export` line to `~/.zshrc` or `~/.bashrc` so it’s set in every new terminal.

Optional: copy `scripts/env-android.example.sh` to `scripts/env-android.sh`, set the path if needed, then run `source ./scripts/env-android.sh` before `pnpm start`.

## NDK: "did not have a source.properties file" (pnpm android / expo run:android)

If `pnpm android` fails with **"NDK at .../ndk/27.1.12297006 did not have a source.properties file"**, the NDK install is broken or incomplete. Fix by reinstalling that NDK version:

1. **Remove the broken NDK folder** (use your actual `ANDROID_HOME` if different):
   ```bash
   rm -rf $ANDROID_HOME/ndk/27.1.12297006
   ```
2. **Reinstall the NDK** using the SDK command-line tools:

   ```bash
   $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --install "ndk;27.1.12297006"
   ```

   If `cmdline-tools/latest` is missing, install it first: Android Studio → **Settings → Appearance & Behavior → System Settings → Android SDK** → **SDK Tools** tab → enable **Android SDK Command-line Tools** → Apply. Then run the `sdkmanager` command above from the path shown in SDK location (e.g. `~/Android/Sdk/cmdline-tools/latest/bin/sdkmanager`).

   **Alternative:** In Android Studio → **Settings → Android SDK → SDK Tools** → uncheck **NDK (Side by side)**, Apply → check it again and choose version **27.1.12297006** if offered → Apply to reinstall.

3. Run **`pnpm android`** again.

## Run on physical Android device

1. **On phone:** Settings → About → tap Build number 7× → back → Developer options → enable **USB debugging**.
2. **Connect:** USB cable, or same Wi‑Fi as dev machine.
3. **Start dev server:** `pnpm start` (or `pnpm run android` for Android-only).
4. **Expo Go:** Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent), open it, scan QR from terminal. Or with USB: `adb reverse tcp:8081 tcp:8081` then open Expo Go and choose the project.
5. **Development build (optional):** For native modules, use EAS: `pnpm add -g eas-cli`, `eas build -p android --profile development`, install the APK, then `pnpm start` and open from the dev build.

## Debug in Cursor

1. **Extensions:** Install **React Native Tools** and **Expo Tools** (or **Expo** by Expo) in Cursor.
2. **Port:** Expo Metro usually uses port **8081**. If different, set `react-native.packager.port` in Cursor/VS Code settings.
3. **Launch config:** In `.vscode/launch.json` add an “Attach to packager” config (see below).
4. **Flow:** Run `pnpm start`, open app on device/emulator, then in Cursor start **Debug: Attach to packager** (F5 or Run panel). Set breakpoints in `.ts`/`.tsx` and use Dev Menu (shake or `m` in terminal) for reload/inspector.

Example `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Expo",
      "type": "reactnative",
      "request": "attach",
      "port": 8081,
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

If your packager runs on another port (e.g. 19001), set `"port": 19001` and ensure Cursor’s `react-native.packager.port` matches.

## Dev with Android Studio

1. **Generate native project (one-time):** In project root run `npx expo prebuild` to create the `android/` (and `ios/`) folder. Use `--clean` to regenerate.
2. **Open in Android Studio:** File → Open → select the project root (or the `android` folder). Let Gradle sync.
3. **Run on emulator:** Create/start an AVD in Device Manager, then Run (green play) or **Run → Run 'app'**. Or from terminal: `pnpm run android` (Expo will run the dev client).
4. **Run on real device:** Enable USB debugging on the phone, connect USB, pick the device in the run target dropdown, then Run.
5. **Workflow:** Keep using `pnpm start` for the Metro bundler; Android Studio runs the native app that connects to Metro. For native code (Java/Kotlin, Gradle) or layout inspection, use Android Studio; for JS/TS use Cursor and attach debugger as above.

### Run from Android Studio with hot reload

1. **Start Metro first:** In a terminal (e.g. in Cursor), run `pnpm start` and leave it running.
2. **Run the app from Android Studio:** Choose your emulator or device, then click Run (green play). The app loads JS from Metro, so it gets **hot reload** (Fast Refresh) when you change `.ts`/`.tsx` files—no need to rebuild.
3. If the app doesn’t pick up changes, shake the device (or press `m` in the Metro terminal) and choose **Reload**, or ensure the device/emulator can reach your machine on the Metro port (e.g. `adb reverse tcp:8081 tcp:8081` for USB device).

## Build for production (Android)

Use **EAS Build** to produce a release build for distribution (Google Play or sideload).

### Prerequisites

- Expo account (sign up at [expo.dev](https://expo.dev)).
- EAS CLI: `pnpm add -g eas-cli` (or use `npx eas-cli`).
- One-time login: `eas login`.

### Production build (Google Play)

1. **Configure (one-time):** In project root run `eas build:configure`. This creates or updates `eas.json`. The repo already has `eas.json` with a `production` profile that outputs **AAB** (Android App Bundle), which is required for Google Play.
2. **Build:**
   `eas build -p android --profile production`
3. Build runs on Expo’s servers. When it finishes, download the `.aab` from the [EAS dashboard](https://expo.dev/accounts/[your-account]/projects/databasing-documents-mobile-apps/builds) or from the CLI link.
4. **Upload to Play Console:** In [Google Play Console](https://play.google.com/console) create (or select) the app, then upload the AAB in Release → Production (or internal testing).

### Production APK (sideload / direct install)

Same as production build but outputs a single **APK** (no Play Store upload):

- `eas build -p android --profile production-apk`
- Download the APK from the build page and install on the device (enable “Install from unknown sources” if needed).

### Preview profile (sideload / testing)

For a quick test APK (e.g. internal distribution), use the **preview** profile (APK, internal distribution, same prod API URL as in `eas.json`):

- `eas build -p android --profile preview`
- Download the APK from the build page and install on the device.

### Build APK locally (no EAS)

To build the release APK on your **local machine** instead of EAS:

1. **One-time:** Generate the native `android/` project (if not already present):

   ```bash
   npx expo prebuild -p android
   ```

2. **Build release APK:**

   ```bash(allow to run this on fish)
   npx expo run:android --variant release
   ```

   The APK is written to `android/app/build/outputs/apk/release/app-release.apk` (path may vary slightly). Install it on the device or copy elsewhere.

   **Or** use Gradle directly after prebuild:

   ```bash
   cd android && ./gradlew assembleRelease && cd ..
   ```

   Output: `android/app/build/outputs/apk/release/app-release.apk`.

**Note:** Local builds use `.env` (or your shell env) for `EXPO_PUBLIC_*`; they do **not** use `eas.json` env. Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to your backend URL (e.g. `https://ddapi.piaosiyuan.cn`) before building.

### Summary

| Goal               | Command                                         | Output                             |
| ------------------ | ----------------------------------------------- | ---------------------------------- |
| Play Store release | `eas build -p android --profile production`     | `.aab`                             |
| **Production APK** | `eas build -p android --profile production-apk` | `.apk`                             |
| Preview / test     | `eas build -p android --profile preview`        | `.apk`                             |
| **Local APK**      | `npx expo run:android --variant release`        | `.apk` (in `android/.../release/`) |
