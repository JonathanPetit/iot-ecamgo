cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "phonegap-nfc.NFC",
    "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
    "pluginId": "phonegap-nfc",
    "runs": true
  },
  {
    "id": "cordova-plugin-mqtt.MQTTEmitter",
    "file": "plugins/cordova-plugin-mqtt/www/MQTTEmitter.js",
    "pluginId": "cordova-plugin-mqtt",
    "clobbers": [
      "ME"
    ]
  },
  {
    "id": "cordova-plugin-mqtt.CordovaMqTTPlugin",
    "file": "plugins/cordova-plugin-mqtt/www/cordova-plugin-mqtt.js",
    "pluginId": "cordova-plugin-mqtt",
    "clobbers": [
      "cordova.plugins.CordovaMqTTPlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "phonegap-nfc": "1.0.3",
  "cordova-android-support-gradle-release": "2.0.1",
  "cordova-plugin-mqtt": "0.3.8"
};
// BOTTOM OF METADATA
});