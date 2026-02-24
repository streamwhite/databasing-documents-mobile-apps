# Run on Real Android & Debug in Cursor

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
  Download the APK from the build page and install on the device (enable “Install from unknown sources” if needed).

### Sideload APK (testing / non-Play)

For a quick test APK (e.g. internal distribution):

- `eas build -p android --profile preview`  
  Download the APK and install on the device.

### Summary

| Goal              | Command                                        | Output   |
|-------------------|------------------------------------------------|----------|
| Play Store release| `eas build -p android --profile production`    | `.aab`   |
| **Production APK**| `eas build -p android --profile production-apk`| `.apk`   |
| Sideload / test   | `eas build -p android --profile preview`       | `.apk`   |
