/*
  Periodically forces Shelly to republish all standard MQTT status topics
  (e.g. status/switch:0, status/input:100, status/temperature:0, BLE sensors, etc.)
  by sending the built-in global MQTT command "status_update".

  This ensures regular MQTT updates even when no state change occurs,
  without creating any custom MQTT topics.

  Author: Josef Burger, www.josefburger.cz
*/

// ===== Configuration =====
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// =========================

let topicPrefix = null;
Shelly.call("MQTT.GetConfig", {}, function (cfg) {
  topicPrefix = cfg.topic_prefix;
});

function refreshAllStandardTopics() {
  if (!topicPrefix) return;
  MQTT.publish(topicPrefix + "/command", "status_update", 0, false);
}

MQTT.setConnectHandler(refreshAllStandardTopics);
Timer.set(REFRESH_INTERVAL_MS, true, refreshAllStandardTopics);
