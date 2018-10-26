# FAQ

In this section frequently asked questions will be answered.
This includes design decisions and drawn compromises in the specifics of the Homie convention.

## How do I query/request a property?

You don't.
The MQTT protocol does not implement the request-reply but rather the publish-subscribe messaging pattern.
The Homie convention follows the publish-subscribe principle by publishing data as retained messages on a regular basis.
You might want to rethink the design of your application - in most scenarios a regularly updated information is sufficient.

*Workaround:* You are free to implement your own ideas on top of the basic structure of the Homie convention.
You could either implement a `get` getter topic and its logic to trigger a value update, or you may exploit the concept of Homie properties and define a settable property to trigger a value update.

A discussion on the matter can be found in issue [#79](https://github.com/homieiot/convention/issues/79).

<style> nav.md-nav { display: none !important; } </style>

