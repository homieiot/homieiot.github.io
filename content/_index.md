---
title: "Homie"
desc: "An MQTT Convention for IoT/M2M"
---

## Overview

{{< lrtable >}}
{{< iflex >}}

| Feature                       | TCP    | MQTT   | Homie  |
|-------------------------------|--------|--------|--------|
| Stream based communication    |   ✓    |   –    |   –    |
| Message based communication   |   –    |   ✓    |   ✓    |
| Publish/Subscribe             |   –    |   ✓    |   ✓    |
| Defined topic structure       |   –    |   –    |   ✓    |
| Self–describing topics        |   –    |   –    |   ✓    |
| Multiple Payload types        |   –    |   –    |   ✓    |

{{< /iflex >}}
{{< iflex >}}
MQTT supports easy and unrestricted message-based communication.

However, MQTT doesn't define the structure and content of these messages and their relation. An IoT device publishes data and provides interaction possibilities but a controlling entity will need to be specifically configured to be able to interface with the device.

The Homie convention defines a standardized way of how IoT devices and services announce themselves and their data on the MQTT broker.

It is thereby a crucial aspect on top of the MQTT protocol for *automatic discovery*, *configuration* and *usage* of devices and services.
{{< /iflex >}}
{{< /lrtable >}}


## Example

Homies topic layout follows the pattern "**homie/device/node/property**".

In this example our device has a thermostat functionality where the target
temperature can be read from and written to. The thermostat function
is modelled as **node**, the temperature is a **property** of that node.

The following topics are published as retained messages to the broker:

{{< card >}}
      homie / device123 / $homie → 3.0
      homie / device123 / $name → My device
      homie / device123 / $state → ready
      homie / device123 / $nodes → mythermostat

      homie / device123 / mythermostat / $name → My thermostat
      homie / device123 / mythermostat / $properties → temperature

      homie / device123 / mythermostat / temperature → 22 
      homie / device123 / mythermostat / temperature / $name → Temperature
      homie / device123 / mythermostat / temperature / $unit → °C
      homie / device123 / mythermostat / temperature / $datatype → integer
      homie / device123 / mythermostat / temperature / $settable → true
{{< /card >}}

Any Homie compliant controller can now find "My device" and will find out
about "My thermostat" with "Temperature in °C" and that it needs to publish
to ".../*temperature*/*set*" to change the temperature.

If we got your attention, head over to the <a href="/specification/">specification</a>
and let all your questions being answered.
