const mqtt = require("mqtt");
const Tail = require("tail-file");

const host = "192.168.9.253";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const file='/var/log/suricata/eve.json'

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "emqx",
  password: "public",
  reconnectPeriod: 1000,
});

const topic = "/sensor/alerts";
client.on("connect", () => {
  console.log("Connected");

  new Tail(file, (line) => {
    client.publish(topic, line, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error);
      }
    });
  });
});
