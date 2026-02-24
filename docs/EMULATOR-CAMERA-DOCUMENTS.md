# Emulator: camera and document selection

How to take photos and select documents when developing with Android emulator or iOS Simulator.

## Android emulator

### Camera (take photo)

- **Use host webcam:** When creating the AVD in Device Manager, set **Camera** to **Device** (not "None" or "Emulated"). The emulator will use your computer’s webcam; when the app opens the camera, you see the live feed and can capture.
- **Virtual scene / test image:** In the running emulator, open **Extended controls** (⋯ on the side toolbar) → **Camera**. On Android 11+ you can use **Virtual scene** and add PNG/JPEG images as virtual scene input for testing.

### Select documents (file / gallery picker)

- **Drag and drop:** Drag files from your PC (e.g. Finder/Explorer) onto the **emulator window**. They are saved to the emulator’s storage (e.g. `/sdcard/Download/`) and appear in **Files** or **Downloads**. When your app uses the document picker or “从相册选择”, choose from these.
- **ADB:** Push files into the emulator, then pick them in the app:
  ```bash
  adb push /path/on/pc/document.pdf /sdcard/Download/
  ```
  Open the app’s document/gallery picker and select from Downloads/Files.

## iOS Simulator

### Camera (take photo)

- The Simulator has **no real camera**. For “拍摄文档” you can:
  - Use a **physical device** for real camera testing, or
  - Rely on **photo library**: add images to the Simulator’s Photos (see below), then use the **gallery/pick** path in your app instead of the camera.

### Select documents / images (file or gallery picker)

- **Photos:** Drag image files from the Mac onto the **Simulator window**; they are added to the Simulator’s Photos app. When your app uses “从相册选择” or the image picker, those photos are available.
- **Files app:** Open the **Files** app in the Simulator, then drag a file from the Mac **into the Files app** and save. When your app uses the document picker, browse to the location where you saved (e.g. On My iPhone) to select the file.

## Summary

| Action              | Android emulator                         | iOS Simulator                    |
|---------------------|------------------------------------------|----------------------------------|
| Take photo (camera)  | Set AVD Camera to Device (webcam)        | No camera; use device or gallery |
| Select documents     | Drag file onto emulator, or `adb push`   | Drag into Files app or onto Simulator (Photos for images) |
