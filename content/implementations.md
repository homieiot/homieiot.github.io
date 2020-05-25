---
title: "Implementations"
desc: "The Homie convention differentiates between **Devices** and **Controllers**."
---

{{< lrtable >}}
    {{< itable title="Device" link="#device" divider="true" >}}
    An instance of a physical piece of hardware is called a device. For example, a car, an Arduino/ESP8266 or a coffee machine. It publishes <b>Nodes</b> and <b>Properties</b> to the MQTT broker.
    {{< /itable >}}

    {{< itable title="Controller" link="#controller" >}}
   A controller does not announce anything to the MQTT broker, but discovers and interacts with Devices. There can be more than one Controller interacting with the different devices on the same broker.
    {{< /itable >}}
{{< /lrtable >}}

# Device
Find software libraries and full firmware projects for **Devices** in this section.

## Libraries

A library can be included in your own project to act as a Homie device.

| Name         | Language | Homie Version | Website/Download                                   | Description |
|--------------|----------|---------------|--------------------------------------------|----|
| homie-cpp       | C++        | 3.0   | [GitHub](https://github.com/Thalhammer/homie-cpp) | Homie C++ header only library |
| homie-python    | Python     | 2.1   | [GitHub](https://github.com/jalmeroth/homie-python) | Homie 3.0 as PR |
| Microhomie | µPython   | 4.0.0 | [GitHub](https://github.com/microhomie/microhomie) | MicroPython implementation |
| homie-ESP32     | C++        | 2.0.1 | [GitHub](https://github.com/craftmetrics/esp32-homie) | An esp-idf component for the Homie convention. |
| kotlin-homieiot | kotlin     | 3.0.1 | [GitHub](https://github.com/boc-tothefuture/kotlin-homieiot) | Kotlin implementation for the Homie convention  |
| node-red-homie  | Node-Red   | 2.1   | [GitHub](https://github.com/marvinroger/node-red-contrib-homie) | unmaintained |
| HomieV3         | Python     | 3.0.1 | [GitHub](https://github.com/mjcumming/HomieV3) | Easily build Homie 3.0 devices |
| HomieV4         | Python     | 4.0.0 | [GitHub](https://github.com/mjcumming/homie4) | Easily build Homie 4.0 devices |
| homie_dart      | Dart       | 4.0.0 | [Pub.dev](https://pub.dev/packages/homie_dart) | Implementation for dart (and flutter) |
| LeifHomieLib    | C++        | 3.0.1 | [GitHub](https://github.com/leifclaesson/leifhomielib) | For ESP8266/ESP32 with Arduino |
| node-red-contrib-homie-convention | Node-RED | 4.0.0 | [GitHub](https://flows.nodered.org/node/node-red-contrib-homie-convention)<br>[npm](https://www.npmjs.com/package/node-red-contrib-homie-convention)<br>[Node-RED](https://flows.nodered.org/node/node-red-contrib-homie-convention) | Homie node with auto discovery for node red [forum discussion](https://discourse.nodered.org/t/announce-node-red-contrib-homie-convention)
| homie-for-esp32    | C++        | 3.0.1 | [GitHub](https://github.com/Clon1998/homie-for-esp32) | For ESP32 with Arduino. Limitations: Broadcast is not supported. |

## Firmware

A full featured firmware, ready to be flashed on a supported device type.

| Name         | Language | Homie Version | Website/Download                                   | Description |
|--------------|----------|---------------|--------------------------------------------|----|
| homie-esp8266 | C++     | 2.0.1         | [GitHub](https://github.com/homieiot/homie-esp8266) | |
| homie-esp8266 | C++     | 3.0.1         | [GitHub](https://github.com/homieiot/homie-esp8266/tree/develop-v3) | |
| ESPEasy | C++ | 4.0.0 | [GitHub](https://github.com/letscontrolit/ESPEasy) | Easy to use Firmware for ESP8266/ESP32. Choose dev builds like  `ESP_Easy_mega-yyyymmdd_dev_ESP8266_4M1M.bin` or build your own

## Software projects

A software application that speaks MQTT/Homie and acts as a Homie Device.

| Name         | Language | Homie Version | Website/Download                                   | Description|
|--------------|----------|---------------|--------------------------------------------|-----|
|miflora-mqtt-daemon | Python  | 3.0           | [GitHub](https://github.com/ThomDietrich/miflora-mqtt-daemon) |A linux daemon to fetch and publish data from Mi Flora plant sensors|
|MBMD | Go  | 4.0           | [GitHub](https://github.com/volkszaehler/mbmd) |A linux daemon to fetch and publish data from ModBus devices like power meters and grid inverters|
|Somecomfort-Home | Python  | 4.0           | [GitHub](https://github.com/mjcumming/Somecomfort-Homie) |Homie implementation for Honeywell Total Comfort Thermostats using somecomefort|
|ISY-Home-Brdige | Python  | 4.0           | [GitHub](https://github.com/mjcumming/ISY-Homie_Bridge) |Homie implementation for Universal Devices ISY994 controller|

# Controller

Find software libraries, administrative tools and home automation projects for **Controllers** in this section.

## Libraries

A library can be included in your own project to act as a Controller for Homie devices.

| Name         | Language | Homie Version | Website/Download                                   |
|--------------|----------|---------------|--------------------------------------------|
| Homie-Device | Node JS  | 3.0           | [npmjs](https://www.npmjs.com/package/homie-device) |
| homie-cpp | C++  | 3.0           | [GitHub](https://github.com/Thalhammer/homie-cpp) |


## Administration

Administrative tools usually allow you to detect, list and interact with Homie devices.

| Name         | Homie | Download| Implementation notes   |
|--------------|----------|---------------|--------------------------------------------|
| Hodmin      | 2.0      | [Website](https://github.com/rttools/hodmin) |  |
| Homie-ota    |3.0 + Custom OTA | [GitHub](https://github.com/jpmens/homie-ota) | OTA Server for devices running the homie-esp8266 firmware |
| HoDD         | 3.0.1 / 4.0.0 | [GitHub](https://github.com/rroemhild/hodd) | Browser based device discovery |


## Home automation

Home automation software in this list allows you to detect and interact with Homie devices
and integrate them into your automation plan.

| Name         |Version| Homie | Download| Implementation notes   |
|--------------|-------|-------|------------------------------------|-------------------|
| openHAB      |  2.4+ | 3.0   | [Website](https://www.openhab.org) | No node instances |
| HomeAssistant| WIP   | 2.0   | [Website](https://github.com/nerdfirefighter/HA_Homie/tree/dev) | Module need to be installed into HA installation |
| Node-RED     | 0.20+ | 4.0.0 | [Node-RED](https://nodered.org)<br>[node-red-contrib-homie-convention](https://flows.nodered.org/node/node-red-contrib-homie-convention) | install node-red-contrib-homie-convention node with auto discovery [forum discussion](https://discourse.nodered.org/t/announce-node-red-contrib-homie-convention)

# Works with Homie

We recommendent all projects which are implementing Homie to refer to this convention using our label.
Please refer on websites directly to these labels to use always current version.

## SVG version

[![works with MQTT Homie](/img/works-with-homie.svg "[works with MQTT Homie")](https://homieiot.github.io/)

HTML snippet:

{{< card >}}

```html
<a href="https://homieiot.github.io/">
  <object type="image/svg+xml" data="https://homieiot.github.io/img/works-with-homie.png">
    works with MQTT Homie
  </object>
</a>
```

{{< /card >}}

## PNG version

[![works with MQTT Homie](/img/works-with-homie.png "works with MQTT Homie")](https://homieiot.github.io/)

HTML snippet:

{{< card >}}

```html
<a href="https://homieiot.github.io/">
  <img src="https://homieiot.github.io/img/works-with-homie.png" alt="works with MQTT Homie">
</a>
```

{{< /card >}}
