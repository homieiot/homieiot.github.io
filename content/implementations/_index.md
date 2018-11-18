# Implementations

<center>
The Homie convention differentiates between **Devices** and **Controllers**.
</center>

<div style="display:flex;margin-bottom:40px;justify-content:center">

<a href="#device" style="display:block;flex:1 0 10px;text-decoration:none">
<table>
<thead><tr><th>Device</th></tr></thead>
<tr><td>
An instance of a physical piece of hardware is called a device. For example, a car, an Arduino/ESP8266 or a coffee machine. It publishes <b>Nodes</b> and <b>Properties</b> to the MQTT broker.
</td></tr>
</table>
</a>
<div style="font-size:3em;flex:0 0 auto;"><i class="fas fa-arrows-alt-h"></i></div>
<a href="#controller" style="display:block;flex:1 0 10px;text-decoration:none">
<table style="margin-top:0">
<thead><tr><th>Controller</th></tr></thead>
<tr><td>
A controller does not announce anything to the MQTT broker, but discovers and interacts with Devices. There can be more than one <b>Controller</b> interacting with the different devices on the same broker.
</td></tr>
</table>
</a>

</div>

# Device
Find software libraries and full firmware projects for **Devices** in this section.

## Libraries

A library can be included in your own project to act as a Homie device.

| Name         | Language | Homie Version | Website/Download                                   | Description |
|--------------|----------|---------------|--------------------------------------------|----|
| homie-cpp | C++  | 3.0           | [GitHub](https://github.com/Thalhammer/homie-cpp) | Homie C++ header only library |
| homie-python | Python  | 2.1           | [GitHub](https://github.com/jalmeroth/homie-python) | |
| homie-micropython | µPython  | 2.0.1           | [GitHub](https://github.com/microhomie/micropython-homie) | WIP |
| node-red-contrib-homie | Node-Red  | 2.1           | [GitHub](https://github.com/marvinroger/node-red-contrib-homie) | WIP |
| homie-ESP32 | C++  | 2.0.1           | [GitHub](https://github.com/craftmetrics/esp32-homie) | An esp-idf component for the Homie convention. |
| kotlin-homieiot | kotlin  | 3.0           | [GitHub](https://github.com/boc-tothefuture/kotlin-homieiot) | WIP Kotlin implementation for the Homie   |

## Firmware

A full featured firmware, ready to be flashed on a supported device type.

| Name         | Language | Homie Version | Website/Download                                   | Description |
|--------------|----------|---------------|--------------------------------------------|----|
| homie-esp8266 | C++  | 2.0.1           | [GitHub](https://github.com/marvinroger/homie-esp8266) | An Arduino for ESP8266 implementation of Homie, an MQTT convention for the IoT.|


## Software projects

A software application that speaks MQTT/Homie and acts as a Homie Device.

| Name         | Language | Homie Version | Website/Download                                   | Description|
|--------------|----------|---------------|--------------------------------------------|-----|
|miflora-mqtt-daemon | Python  | 3.0           | [GitHub](https://github.com/ThomDietrich/miflora-mqtt-daemon) |A linux daemon to fetch and publish data from Mi Flora plant sensors|

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


## Home automation

Home automation software in this list allows you to detect and interact with Homie devices
and integrate them into your automation plan.

| Name         |Version| Homie | Download| Implementation notes   |
|--------------|-------|-------|------------------------------------|-------------------|
| openHAB      |  2.4+ | 3.0   | [Website](https://www.openhab.org) | No node instances |
| HomeAssistant| WIP   | 2.0   | [Website](https://github.com/nerdfirefighter/HA_Homie/tree/dev) | Module need to be installed into HA installation |


