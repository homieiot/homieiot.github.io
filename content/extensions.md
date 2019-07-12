---
title: "Homie Extensions"
desc: "Homie can be extended"
---

The Homie convention defines a standardized way of how devices and services announce themselves and defines the structure and content of messages and their relation.

It does not define domain types, like a lightbulb and required properties for a Home Automation domain.
It also not defines procedures like Over-The-Air updates and metrics like cpu usage or memory consumption.

That is what extensions are for.

## License
Every extension must be published using a license.
The license can be chosen freely, even proprietary licenses are possible.
The recommended license is the [CCA 4.0](https://homieiot.github.io/license), since this is the license Homie itself uses.

## Extension Identifier
Every extension is identified by an unique ID and will be linked from this section.
The ID consists of the reverse domain name and a freely chosen suffix.
For example, an organization *example.org* wanting to add a feature *our-feature* would choose the extension ID *org.example.our-feature*.
The proper term *homie* is reserved and must not be used as the suffix or as part of the domain name.

If a device decides to implement an extension, a new entry in the `$extensions` list of that device is required.
The new **extensions entry** has to be formated in the following way:
*extension ID*:*extension version*:[*homie versions*]
where *extension ID* is the extension ID and *extension version* the version of the extension.
An extension might be designed to support different versions of the Homie convention.
This is reflected by the *homie versions* part, which is a semicolon (`;`) separated list of all supported Homie versions.

For example the [Meta extension]() with the extension ID *eu.epnw.meta* and version *1.1.0* supports Homie `3.0.1` and `4.x`.
The resulting $extensions entry is *eu.epnw.meta:1.1.0:[3.0.1;4.x]*.
The [Legacy Stats extension]() with the extension ID *org.homie.legacy-stats* and version *0.1.1* supports Homie `4.x`, so the $extensions entry is *org.homie.legacy-stats:0.1.1:[4.x]*.
Now, if the device *super-car* implements both extensions it publishes
```java
homie/super-car/$extensions → "eu.epnw.meta:1.1.0:[3.0.1;4.x],org.homie.legacy-stats:0.1.1:[4.x]"
```

## Extension Datatypes
An extension may define new datatypes and formats for them.
	
## New Attributes
An extension may add new attributes to devices, nodes and properties.
The attributes MUST start with a `$`. Attributes are always **retained**.
An attribute may have no value, but instead act as a root for more nested attributes.
This is necessary to distinguish a nesting attribute from a node (if the nesting attribute is added to a device) or from a property (if its added to a node).
In the following example *$certifications* is the **nesting** attribute, which serves as root for the **nested** *$european-union* and *$usa* attributes.
```java
homie/super-car/engine/$certifications/$european-union → "Euro 6b"
homie/super-car/engine/$certifications/$usa → "Tier 3"
```
**Nested** attributes may start with `$` but don't have to.
This means, that in the above example using *homie/super-car/engine/$certifications/usa* would have been a valid topic, too.
An extension document may decide which extension attributes are **required** and which are **optional**.
If they are optional, default values may be given. Additionally, given examples for each attribute are recommended.

## Create your own extension

To create an own extension,

* fork the Homie repository,
* create a new branch,
* write your extension in `documents/extensions/your-extension-id.md` based on the [extension template](),
* and create a pull request.

# Homie Extensions

<!--EXTENSIONS-->

| Extension       | Extension Identifier      | Description                                                                                         | Document   |
|-----------------|---------------------------|-----------------------------------------------------------------------------------------------------|------------|
| Legacy Stats    | org.homie.legacy-stats    | This extension adds the stats functionality of Homie `3.0.1` to Homie `4.0`                         | [GitHub]() |
| Legacy Firmware | org.homie.legacy-firmware | This extension adds the firmware, mac and localip device attributes of Homie `3.0.1` to Homie `4.0` | [GitHub]() |
| Meta            | eu.epnw.meta              | This extension defines how to add metadata and tags to devices, nodes and properties                | [GitHub]() |
