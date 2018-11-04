# The Homie MQTT Convention

The Homie convention strives to be a **communication definition on top of MQTT** between IoT devices and controlling entities.

> [MQTT](http://mqtt.org) is a machine-to-machine (M2M)/"Internet of Things" connectivity protocol.
> It was designed as an extremely lightweight publish/subscribe messaging transport.

MQTT supports easy and unrestricted message-based communication.
However, MQTT doesn't define the structure and content of these messages and their relation.
An IoT device publishes data and provides interaction possibilities but a controlling entity will need to be specifically configured to be able to interface with the device.

The Homie convention defines a **standardized way** of how IoT devices and services announce themselves and their data on the communication channel.
The Homie convention is thereby a crucial aspect in the support of **automatic discovery, configuration and usage** of devices and services over the MQTT protocol.

## In a nutshell

For everyone familiar with MQTT, this is Homie in a nutshell.
See the navigation list on the left and have a look at the full specification.

Homies topic layout is "**homie/device/node/property**" eg. "*homie/device123/thermostat/temperature*".
The Homie version, device state, device name, published nodes, published properties per node, property name and type are required:

<pre>
homie/device123/$version → 3.0
homie/device123/$name → My device
homie/device123/$state → ready
homie/device123/$nodes → thermostat
homie/device123/thermostat/$name → My thermostat
homie/device123/thermostat/$properties → temperature
homie/device123/thermostat/temperature/$name → Temperature
homie/device123/thermostat/temperature/$type → integer
</pre>

* A property can be of type integer, float, boolean, string, enum, color.
* The property topic itself contains the state.
* The command topic is "*homie/device123/thermostat/temperature/set*".

That's it!

## MQTT Restrictions

Homie communicates through [MQTT](http://mqtt.org) and is hence based on the basic principles of MQTT topic publication and subscription.

### Topic IDs

An MQTT topic consists of one or more topic levels, separated by the slash character (`/`).
A topic level ID MAY contain lowercase letters from `a` to `z`, numbers from `0` to `9` as well as the hyphen character (`-`).

A topic level ID MUST NOT start or end with a hyphen (`-`).
The special character `$` is used and reserved for Homie *attributes*.
The underscore (`_`) is used and reserved for Homie *node arrays*.

### Payload

Every MQTT message payload MUST be sent as UTF-8 encoded string.
A numeric data type MUST contain a numeric value published as string with the decimal separator, if any, being a dot. 
Booleans MUST be converted to "true" or "false".

### QoS and retained messages

The nature of the Homie convention makes it safe about duplicate messages, so the recommended QoS for reliability is **QoS 1**.
All messages MUST be sent as **retained**, UNLESS stated otherwise.

