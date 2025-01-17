// Path: scripts/preload.js

const { setConfig, getConfig, addHook, setSkin, navigateToUrl, navigateToPageTag } = WebCardinal.preload;
const { define } = WebCardinal.components;

async function initializeWebCardinalConfig() {
  const config = getConfig();
  // config.translations = false;
  return config;
}

function createIonicContext() {
  const ionicPath = "https://cdn.jsdelivr.net/npm/@ionic/core/";
  const ioniconsPath = "https://unpkg.com/ionicons@5.5.2/";

  const styles = Object.assign(document.createElement("link"), {
    rel: "stylesheet",
    href: `${ionicPath}css/ionic.bundle.css`,
  });
  const ionic = Object.assign(document.createElement("script"), {
    type: "module",
    src: `${ionicPath}dist/ionic/ionic.esm.js`,
  });
  const ionicons = Object.assign(document.createElement("script"), {
    type: "module",
    src: `${ioniconsPath}dist/ionicons/ionicons.esm.js`,
  });

  return {
    injectIonic: () => {
      document.head.append(styles, ionic, ionicons);
    },
    removeIonic: () => {
      ionicons.remove();
      ionic.remove();
      styles.remove();
    },
  };
}

const preloadContext = {
  ...createIonicContext(),
};

// WebCardinal App Tester components
define("webcat-section", { shadow: true });
define("webcat-card", { shadow: true });

// Testing components
define("fa-icon");
define("accordion-item");
define("test-component");
define("test-translations");
define("test-translations-complex", "test-translations/test-translations-complex", {
  shadow: true,
});
define("test-input");
define("test-input-with-dashes", "test-input/test-input-with-dashes");
define("test-squares");
define("test-multiple-bindings-component");
define("test-container");
define("test-container-scoped", "test-container/test-container-scoped");
define("rw-pagination", { shadow: true });
define("scanner-options");
define("scanner-data");
define("scanner-modal", { shadow: true });
define("scanner-downloader-options", "scanner-options/scanner-downloader-options");
define("scanner-checker-options", "scanner-options/scanner-checker-options");

addHook("beforePageLoads", "404", async () => {
  await navigateToUrl("/webcardinal-app-tester");
});

// Testing setSkin
addHook("beforePageLoads", "translations-test-2", () => {
  setSkin("ro");
});

addHook("whenPageClose", "translations-test-2", () => {
  setSkin("default");
});

// Injecting Ionic Distribution
for (const tag of [
  "webc-datasource:test-6",
  "webc-datasource:test-7",
  "webc-datasource:test-8",
  "accordion",
]) {
  addHook("beforePageLoads", tag, () => {
    preloadContext.injectIonic();
  });

  addHook("whenPageClose", tag, () => {
    preloadContext.removeIonic();
  });
}

const config = await initializeWebCardinalConfig();
setConfig(config);
