# Legacy Wear

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-red.svg)](https://www.gnu.org/licenses/agpl-3.0)
![PWA](https://img.shields.io/badge/PWA-enabled-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

## Overview

**Legacy Wear** is an open-source, privacy-first Progressive Web App (PWA), that can be
installed on your device and used offline. It runs in supported browsers across different platforms and let's you connect to and manage Bluetooth-enabled fitness trackers and smartwatches.

The project focuses on **legacy and discontinued Bluetooth wearables**, helping keep devices usable even after official support has ended. It provides a web app to configure, sync, and manage devices from different manufacturers, without relying on proprietary apps or cloud services.

### Why Legacy Wear?

- **No Accounts Required** – your data stays on your device
- **Cross-Platform** – works across supported browsers and operating systems
- **Offline First** – installable as a PWA and usable without an internet connection
- **Hardware Longevity** – keeps devices usable after official support ends
- **Sustainable Use**

## Demo

- Live App: [web-app](https://legacy-wear.web.app)
- Screenshots / Video: [demo video](https://to-add)
    <!-- <video src="https://to-add" controls width="100%"></video>
  commit msg: docs: embed demo video in README -->
  > Note: Web Bluetooth requires a supported browser such as Chrome.

## Screenshots

![Home](https://res.cloudinary.com/dbwchwxbc/image/upload/v1786225602/legacy_wear_github_readme_uvztdp.png)

## Features

Depending on the device, the app may support:

- **Reading data from devices**, such as activity points, step count, or other available metrics
- **Sending configuration commands**, such as setting the time, configuring alarms, and adjusting device-specific preferences

⚠️ **Note:** Feature availability depends on each device’s capabilities and level of protocol support.

## How to Use (For Users)

You do not need to install anything from an app store.

1. Open [Live App Link](https://legacy-wear.web.app) in a supported browser (like Google Chrome on Android or macOS).
2. Ensure your device's Bluetooth and Location Services are turned on.
3. Wake up your wearable, click **"Connect"** in the web app, and select your device from the list.

## Browser Compatibility

Web Bluetooth is a powerful but specialized web standard. Please check the compatibility matrix below before trying to connect your device:

| Operating System      |    Google Chrome     |    Microsoft Edge    |    Brave Browser     |  Safari / Firefox  |
| :-------------------- | :------------------: | :------------------: | :------------------: | :----------------: |
| **Android**           |    ✅ (Supported)    |    ✅ (Supported)    |    ✅ (Supported)    | ❌ (Not Supported) |
| **macOS**             |    ✅ (Supported)    |    ✅ (Supported)    |    ✅ (Supported)    | ❌ (Not Supported) |
| **Windows**           |    ✅ (Supported)    |    ✅ (Supported)    |    ✅ (Supported)    | ❌ (Not Supported) |
| **Linux**             | ⚠️ (Requires Flag\*) | ⚠️ (Requires Flag\*) | ⚠️ (Requires Flag\*) | ❌ (Not Supported) |
| **iOS (iPhone/iPad)** |  ❌ (Not Supported)  |  ❌ (Not Supported)  |  ❌ (Not Supported)  | ❌ (Not Supported) |

> ⚠️ **iOS Users:** Apple strictly blocks the Web Bluetooth API across _all_ browsers on iOS. iPhone users will need a specialized third-party browser (like _Bluefy_ or _WebBLE_) to use this application.
>
> \* **Linux Users:** You may need to enable experimental web platform features by navigating to `chrome://flags/#enable-experimental-web-platform-features` in your browser URL bar.

---

## Technology Stack

- **[React](https://react.dev/)** (Create React App)
- **[Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)**
- **[Progressive Web App (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)**

React was chosen for its popularity, making it easier for developers of all skill levels to contribute.

## Supported Devices

- TO-ADD

### Future Support

Support for additional Bluetooth fitness trackers and smartwatches is planned, with a focus on devices that are no longer actively supported by their manufacturers.

## Important Notice

- This app is a **Progressive Web App (PWA)** — installable and functional offline.
- Uses **Web Bluetooth**, which may require manual activation in browser settings.
- **Location services must be enabled** on your device for Bluetooth functionality
- The app **does not collect or share personal data**.

### Tested Platforms

- Chrome for Android
- Chrome on macOS

## Getting Started with Development

This project was bootstrapped with **Create React App**.

### Available Scripts

Run these commands in the project directory:

`npm install`  
Installs dependencies

`npm start`  
Runs the app in development mode at http://localhost:3000

`npm test`  
Launches the test runner in interactive watch mode

`npm run build`  
Builds the app for production into the build folder

`npm run eject`  
Ejects Create React App configuration (one-way operation)

---

## Contributing

Contributions are welcome! Whether you want to report issues, test new devices, improve the ui, or expand support for additional wearables, anyone can contribute.

- Check the **TODO file** for planned features and future work
- Submit **issues, feature requests, or pull requests**
- Help expand support for additional Bluetooth devices

The goal is to build a sustainable, community-maintained compatibility layer for wearable devices.

---

## Analytics & Privacy

This project is hosted on Google Firebase. For details, see [Firebase's Privacy & Security Documentation](https://firebase.google.com/support/privacy).

It uses [GoatCounter](https://www.goatcounter.com/) for aggregated, privacy-friendly analytics. For details, see [GoatCounter's Privacy Policy](https://www.goatcounter.com/help/privacy).

Beyond the above, this project does not collect any personally identifiable information (PII) from visitors, nor does it use cookies or tracking technologies that identify individual users.

## Disclaimer

Legacy Wear is an independent, open-source project intended for interoperability and sustainability purposes. It is not affiliated with, endorsed by, or connected to any wearable device manufacturers mentioned in this project.

This application is provided **“as is”**, without warranty of any kind.  
The author is not responsible for any damage, data loss, or unexpected behavior.  
By using this app, you accept full responsibility for its operation.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** — see the [LICENSE](LICENSE) file for details.
