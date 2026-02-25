# Debug React Native / Expo in Cursor

Concise guide: breakpoints in Cursor and common practices for debugging Expo apps.
use cursor debug mode which is best.

## Breakpoints in Cursor

1. **Extensions:** Install **React Native Tools** (and **Expo** by Expo) in Cursor.
2. **Metro running:** Start the packager (`pnpm start`) and open the app on device or emulator.
3. **Attach debugger:** Run → **Start Debugging** (F5) or choose **“Attach to Expo”** in the Run panel. This attaches to the Metro packager (port 8081).
4. **Set breakpoints:** Open a `.ts` or `.tsx` file, click in the gutter left of the line number to add a red breakpoint. Execution will pause when that line runs.
5. **Trigger code:** Use the app (e.g. tap a button, navigate) so the code path with the breakpoint runs. When it hits, Cursor stops and you can inspect variables, step (F10/F11), and continue (F5).

**If breakpoints don’t hit:** Ensure (1) Metro is on 8081 (or set `"port"` in `.vscode/launch.json` and `react-native.packager.port` in settings), (2) the app was reloaded after attaching (shake device → Reload, or `r` in Metro), (3) the file with the breakpoint is the one bundled (check Metro’s resolved path).

## Launch config (already in repo)

`.vscode/launch.json` has an **“Attach to Expo”** config that attaches to port 8081. Use it from the Run panel; no need to “launch” Metro from Cursor—run `pnpm start` in a terminal, then attach.

## Best practices (industry)

| Practice                 | Use when                                                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Breakpoints + attach** | Step-through debugging, inspect state at a specific line (e.g. before/after API call).                                                          |
| **Console logs**         | Quick trace (e.g. `console.log('payload', payload)`). Prefer removal before commit.                                                             |
| **React DevTools**       | Inspect component tree, props, state. Install “React Developer Tools” and connect to the app (Expo Go or dev build).                            |
| **Chrome DevTools**      | Network, console, sources. In dev menu: “Debug Remote JS” (or “Open JS Debugger”) to open Chrome; set breakpoints in the browser’s Sources tab. |
| **Flipper** (optional)   | Network, layout, logs, Redux. Useful for native/network debugging; requires Flipper desktop + app plugin.                                       |
| **Dev menu**             | Shake device or `m` in Metro: Reload, Fast Refresh, inspector, debugger.                                                                        |
| **Error overlay**        | Red screen shows stack; tap to open in editor if configured.                                                                                    |

**Flow:** Start with breakpoints in Cursor (attach to Expo) for JS/TS. Use Chrome “Debug Remote JS” if you prefer browser devtools. Use React DevTools for component state; use Flipper or network logs for API/network issues.

## Quick checklist

1. `pnpm start` → app open on device/emulator.
2. F5 in Cursor → “Attach to Expo” (port 8081).
3. Set breakpoint in `.tsx` → trigger that code in the app → inspect and step.

## Troubleshooting: “socket hang up” / “Disconnected from the Proxy” (error 1410)

This usually means the debugger lost the connection between Metro and the app. Try in this order:

1. **Order of operations**
   - Start **Metro first** (`pnpm start`) and leave it running.
   - **Open the app** on device/emulator and **wait until it’s fully loaded** (app screen visible, not the “Connecting…” or loading screen).
   - **Then** in Cursor run **Attach to Expo** (F5). Do not attach before the app is connected to Metro.

2. **Single Metro, single app**
   - Only one Metro process (no other `pnpm start` or `expo start`).
   - Only one app instance connected (close Expo Go and reopen, or reload once).

3. **Port 8081**
   - Metro must be on 8081 (default). If you use another port, set `"port": 8081` in `.vscode/launch.json` to match, and in Cursor settings set `react-native.packager.port` to the same.
   - If something else uses 8081: stop it, or start Metro with `pnpm start -- --port 8081` and keep that port in launch.json.

4. **Reload after attach**
   - After attaching, shake the device (or press `m` in the Metro terminal) → **Reload**. Then trigger the code path with your breakpoint again.

5. **Use Chrome as fallback (breakpoints still work)**
   - In the app: open dev menu (shake or `m` in Metro) → **“Open JS Debugger”** (or “Debug Remote JS”).
   - Chrome opens; in Chrome DevTools open **Sources**, find your bundle or file, set breakpoints there, and reload the app. This avoids the Cursor ↔ Metro ↔ app socket and is often more reliable with Expo/Hermes.
