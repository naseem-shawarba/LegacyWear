import styles from "./AppInfo.module.css";

export const AppInfo = () => {
  return (
    <div className={styles.container}>
      <h1>Important Notice</h1>

      <p>
        <strong>Legacy Wear</strong> is an open-source, privacy-first
        Progressive Web App (PWA) that can be installed on your device and used
        offline. It runs in supported browsers across different platforms and
        lets you connect to and manage Bluetooth-enabled fitness trackers and
        smartwatches.
      </p>

      <p>
        The project focuses on{" "}
        <strong>legacy and discontinued Bluetooth wearables</strong>, helping
        keep devices usable even after official support has ended. It provides a
        web app to configure, sync, and manage devices from different
        manufacturers, without relying on proprietary apps or cloud services.
      </p>

      <p>
        This app uses <strong>Web Bluetooth</strong> technology. To use
        Bluetooth features, your device’s location services may need to be
        enabled. This is required by the web browser’s Web Bluetooth API and is
        not used by this application to track or store your location.
      </p>

      <p>
        If Bluetooth does not connect immediately, please check your browser
        settings, as Web Bluetooth support may require manual activation.
      </p>

      <p>
        Legacy Wear does{" "}
        <strong>not collect, store, or share personal data</strong>. All data
        remains on your device.
      </p>

      <p>
        The application has been tested primarily on <strong>Chrome</strong> for
        Android and macOS. Feature availability depends on each device’s
        capabilities and level of protocol support.
      </p>

      <p>
        For a full list of supported devices and compatibility details, please
        refer to the project’s{" "}
        <a
          href="https://github.com/naseem-shawarba/legacy-wear#supported-devices"
          target="_blank"
          rel="noopener noreferrer"
        >
          README on GitHub
        </a>
        .
      </p>

      <p>
        For more information, see{" "}
        <a
          href="https://web.dev/bluetooth/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web Bluetooth
        </a>{" "}
        and{" "}
        <a
          href="https://web.dev/progressive-web-apps/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Progressive Web Apps (PWA)
        </a>
        .
      </p>

      <h2>Disclaimer</h2>

      <p>
        Legacy Wear is an independent, open-source project intended for
        interoperability and sustainability purposes. It is not affiliated with,
        endorsed by, or connected to any wearable device manufacturers mentioned
        in this project.
      </p>

      <p>
        This application is provided <strong>“as is”</strong>, without warranty
        of any kind. The author is not responsible for any damage, data loss, or
        unexpected behavior resulting from its use. By continuing, you accept
        full responsibility for using this application.
      </p>
      <p>
        Licensed under GNU AGPLv3. Source code and license terms available on{" "}
        <a
          href="https://github.com/naseem-shawarba/legacy-wear"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
};
