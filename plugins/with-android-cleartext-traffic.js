const { withAndroidManifest } = require('@expo/config-plugins');

/** Allow HTTP to the local Laravel API during dev builds. */
function withAndroidCleartextTraffic(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];
    if (application?.$) {
      application.$['android:usesCleartextTraffic'] = 'true';
    }
    return config;
  });
}

module.exports = withAndroidCleartextTraffic;
