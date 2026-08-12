# Black Moss & Herbs — Mobile App Guide (iOS first, then Android)

This turns the existing website into **real App Store & Google Play apps** using
[Capacitor](https://capacitorjs.com). The app is a native shell around the live
site, so it reuses the same shop, checkout, accounts and database — and updates
the moment you deploy the website (no resubmission for content changes).

Everything up to the native build is already done in this repo:
- ✅ Installable PWA (manifest, service worker, icons, offline page)
- ✅ Capacitor installed + configured (`capacitor.config.ts`)
- ✅ Native plugins added (push notifications, splash screen, status bar, app)
- ✅ npm scripts (`app:add:ios`, `app:sync`, `app:open:ios`, …)

## What you need (the part I can't do from here)

| Requirement | Why | Cost |
|---|---|---|
| A **Mac** with **Xcode** | Apple only allows iOS builds on macOS | — (or a cloud Mac / Codemagic) |
| **Apple Developer Program** | To sign, TestFlight, and submit to the App Store | £79 / year |
| **CocoaPods** (`sudo gem install cocoapods`) | iOS dependency manager Capacitor uses | free |
| (Android later) **Android Studio** | To build the `.aab` for Google Play | free |
| (Android later) **Google Play Console** | To publish | £20 one-time |

No Mac? Use a cloud build service — **Codemagic** or **Ionic Appflow** build and
submit Capacitor apps to the App Store from the cloud. Same repo, no local Xcode.

## iOS — step by step (on the Mac)

```bash
# 1. Clone + install
git clone <this repo> && cd blackmossandherbs-platform
npm install

# 2. Add the native iOS project (creates the /ios folder — do this once)
npm run app:add:ios

# 3. Sync web config + plugins into the native project (run after every change)
npm run app:sync

# 4. Open in Xcode
npm run app:open:ios
```

In Xcode:
1. Select the project → **Signing & Capabilities** → choose your Apple Developer
   **Team**. The bundle id is `com.blackmossandherbs.app` (change in
   `capacitor.config.ts` if you want a different one, then re-run `app:sync`).
2. Add the **Push Notifications** capability (and **Background Modes → Remote
   notifications**) if you're launching push at day one.
3. Plug in an iPhone or pick a simulator → **Run** to test.
4. When happy: **Product → Archive → Distribute App → App Store Connect** →
   upload. Then submit for review from [App Store Connect](https://appstoreconnect.apple.com).

## Android — later (on any OS with Android Studio)

```bash
npm run app:add:android
npm run app:sync
npm run app:open:android      # opens Android Studio → Build → Generate Signed Bundle (.aab)
```
Upload the `.aab` to the [Google Play Console](https://play.google.com/console).

## App Store review — avoid the "it's just a website" rejection (Guideline 4.2)

Apple rejects thin webview wrappers. This app is set up to clear that bar, but
lean into native value before submitting:
- **Push notifications** (order updates, restock, offers) — the biggest reason to
  install. Plugin is already added; wire your provider (APNs directly, or
  OneSignal/Firebase) and send a token to your backend.
- Native **splash screen + status bar** (configured).
- Fill the **App Store listing** properly: real screenshots (6.7" + 6.1" + 5.5"),
  a description centred on the app's benefits, privacy nutrition labels that match
  our Privacy Policy (data: account, purchases, usage; used for app functionality).
- Because we sell **physical goods** via Stripe, you do **not** owe Apple 30% —
  in-app purchase rules apply to digital goods only. Keep checkout as-is.

## Store assets checklist

- [ ] App icon 1024×1024 (use `public/icons/icon-1024.png`)
- [ ] iPhone screenshots (6.7", 6.1", 5.5")
- [ ] App name, subtitle, keywords, description
- [ ] Privacy policy URL → `https://blackmossandherbs.com/legal/privacy`
- [ ] Support URL + marketing URL
- [ ] Age rating questionnaire (wellness/supplements — no age gate needed)
- [ ] Privacy nutrition labels (match the Privacy Policy)

## Updating the app

- **Content / features on the website** → just deploy the site. The app shows the
  new version instantly (it loads the live URL). No resubmission.
- **Native changes** (new plugin, icon, splash, config) → `npm run app:sync`,
  re-archive in Xcode, submit a new build.
