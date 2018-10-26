# Implementations 

The Homie convention differentiates between **Devices** and **Controllers**.

**Devices**: An instance of a physical piece of hardware is called a device. For example, a car, an Arduino/ESP8266 or a coffee machine. It publishes **Nodes** and **Properties** to the MQTT broker.

**Controller**: A controller is also a MQTT client for the broker, but does not publish anything but discovers and interacts with Devices. There can be more than one **Controller** connected to the same broker.

Find implementations for **Devices** and **Controllers** in this section.
