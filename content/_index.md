---
title: "Homie"
desc: "An MQTT Convention for IoT/M2M"
---

## Overview

  <div style="display:flex;justify-content:space-between;"><div style="min-width:400px;padding-right:10px">
## 
| Feature                       | TCP    | MQTT   | Homie  |
|-------------------------------|--------|--------|--------|
| Stream based communication    |   ✓    |   –    |   –    |
| Message based communication   |   –    |   ✓    |   ✓    |
| Publish/Subscribe             |   –    |   ✓    |   ✓    |
| Defined topic structure       |   –    |   –    |   ✓    |
| Self–describing topics        |   –    |   –    |   ✓    |
| Multiple Payload types        |   –    |   –    |   ✓    |

   </div>
   <div style="min-width:400px;padding-left:10px;padding-top:10px">
<p>MQTT supports easy and unrestricted message-based communication.</p><p>However, MQTT doesn't define the structure and content of these messages and their relation. An IoT device publishes data and provides interaction possibilities but a controlling entity will need to be specifically configured to be able to interface with the device.</p>
<p>The Homie convention defines a standardized way of how IoT devices and services announce themselves and their data on the MQTT broker.</p><p>It is thereby a crucial aspect on top of the MQTT protocol for *automatic discovery*, *configuration* and *usage* of devices and services.</p>
   </div>
</div>

## Example

Homies topic layout follows the pattern "**homie/device/node/property**".

In this example our device has a thermostat functionality where the target
temperature can be read from and written to. The thermostat function
is modelled as **node**, the temperature is a **property** of that node.

The following topics are published as retained messages to the broker:

<pre style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);padding:10px;">
homie / device123 / $homie → 3.0
homie / device123 / $name → My device
homie / device123 / $state → ready
homie / device123 / $extensions → ''
homie / device123 / $nodes → my_thermostat

homie / device123 / my_thermostat / $name → My thermostat
homie / device123 / my_thermostat / $properties → temperature

homie / device123 / my_thermostat / temperature → 22 
homie / device123 / my_thermostat / temperature / $name → Temperature
homie / device123 / my_thermostat / temperature / $unit → °C
homie / device123 / my_thermostat / temperature / $type → integer
</pre>

Any Homie compliant controller can now find "My device" and will find out
about "My thermostat" with "Temperature in °C" and that it needs to publish
to ".../*temperature*/*set*" to change the temperature.

If we got your attention, head over to the <a href="/specification/">specification</a>
and let all your questions being answered.
