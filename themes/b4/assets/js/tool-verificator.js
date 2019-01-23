
const deviceMeta = {
    allowed: new Set(["$homie", "$name", "$state", "$nodes", "$stats", "$implementation"]),
    deprecated: new Set(["$mac", "$localip", "$fw/name", "$fw/version"]),
    required: new Set(["$homie", "$name", "$state", "$nodes"])
}
const nodeMeta = {
    allowed: new Set(["$name", "$type", "$properties", "$array"]),
    deprecated: new Set(),
    required: new Set(["$name", "$properties"])
}
const propertyMeta = {
    allowed: new Set(["$name", "$settable", "$retained", "$unit", "$datatype", "$format", "$$value"]),
    deprecated: new Set([]),
    required: new Set(["$name"])
}

const valueRestrictions = new Map([
    ["$name", /^.+$/], // \p{L}\d[[:blank:]]
    ["$homie", /^[0-9\.]+$/],
    ["$settable", /^true$|^false$/],
    ["$retained", /^true$|^false$/],
    ["$state", /^init$|^ready$|^disconnected$|^sleeping$|^lost$|^alert$/],
    ["$nodes", /^[a-z0-9_\-,]+$/i],
    ["$properties", /^[a-z0-9_\-,]+$/i],
    ["$stats", /^$/],
    ["$datatype", /^\b(integer|float|boolean|string|enum|color)\b$/],
]);

/**
 * Converts a topic parts input ["homie","device123","node1",...]
 * into an object tree {"device123":{"node1":...}} without overriding.
 * @param {*} devices The object tree destination
 * @param {*} lineMap Outputs the same object tree but with line numbers instead of values
 * @param {*} topicparts Topic parts ["homie","device123","node1",...]
 * @param {*} value The value ("22")
 * @param {*} lineNumber The line number
 */
function create(devices, lineMap, topicparts, value, lineNumber) {
    var parent = devices;
    var parentLineMap = lineMap;
    for (var t = 1; t < topicparts.length; t += 1) {
        if (topicparts.length - 1 == t) {
            parent[topicparts[t]] = value;
            parentLineMap[topicparts[t]] = lineNumber;
            continue;
        }
        var newChild = parent[topicparts[t]];
        if (!newChild) newChild = {};
        if (!(newChild instanceof Object)) {
            newChild = { "$$value": newChild };
        }
        parent[topicparts[t]] = newChild;
        parent = newChild;

        newChild = parentLineMap[topicparts[t]];
        if (!newChild) newChild = {};
        if (!(newChild instanceof Object)) {
            newChild = { "value": newChild };
        }
        parentLineMap[topicparts[t]] = newChild;
        parentLineMap = newChild;
    }
}

function toObjectTree(value, errors, devices, lineMap) {
    for (var line = 0; line < value.length; line += 1) {
        const i = value[line].indexOf(" ");
        if (i == -1) {
            if (value[line].length)
                errors.push({ line: line, text: "Not in the correct format. Syntax: topic_name topic_value" });
            continue;
        }

        const topicname = value[line].substring(0, i);
        const topicvalue = value[line].substring(i + 1).trim();
        const topicparts = topicname.split("/");

        if (!topicparts.length || topicparts[0] != "homie") {
            errors.push({ line: line, text: "Must begin with homie/" });
            continue;
        }

        if (topicparts.length > 2 && topicparts.length < 6) {
            create(devices, lineMap, topicparts, topicvalue, line);
        } else {
            errors.push({ line: line, text: "Does not describe a device!" });
            continue;
        }
    }
}

/**
 * Check all attributes of an "object". The type ("Device","Node","Property") must be given
 * and the meta information (deviceMeta, ...).
 */
function checkAttributes(type, objectid, object, meta, errors, lineObject) {
    for (let [key, value] of Object.entries(object)) {
        if (key.startsWith("$")) {
            // Check for deprecated
            if (meta.deprecated.has(key)) {
                errors.push({
                    line: lineObject[key],
                    text: type + " '" + objectid + "' has the deprecated attribute '" + key + "' set! Please check with the newest version of the convention."
                });
                continue;
            }
            // Check for allowed
            else if (!meta.allowed.has(key)) {
                errors.push({
                    line: lineObject[key],
                    text: type + " '" + objectid + "' doesn't allow '" + key + "' to be set! Must be one of " + Array.from(meta.allowed).join(', ')
                });
                continue;
            }
            // Check value
            const restriction = valueRestrictions.get(key);
            if (restriction && !value.match(restriction)) {
                errors.push({
                    line: lineObject[key],
                    text: "The value '" + value + "' of '" + objectid + "/" + key + "' does not conform to the convention!"
                });
                continue;
            }
        }
    }

    const entries = new Set(Object.keys(object));
    for (let required of meta.required) {
        if (!entries.has(required)) {
            errors.push({
                line: "n/a",
                text: type + " '" + objectid + "' requires '" + required + "' to be set!"
            });
        }
    }
}

function addLineNumbers() {
    const input = document.getElementById('homieinput');
    var divHeight = input.offsetHeight
    var lineHeight = parseInt(document.defaultView.getComputedStyle(input, null).getPropertyValue("line-height"));
    var lines = divHeight / lineHeight;
    var text = '';
    for (var i = 0; i < lines - 2; ++i)
        text += (i + 1) + "<br>";
    document.getElementById('linenumbers').innerHTML = text;
}

document.addEventListener("MainContentChanged", () => {
    const input = document.getElementById('homieinput');
    if (!input) return;
    // Remove all html markups
    input.addEventListener("focus", () => input.innerText = input.innerText);
    input.addEventListener("change", addLineNumbers);
    addLineNumbers();
    input.innerText = input.innerText;
});

window.homieverificator = () => {
    const input = document.getElementById('homieinput');
    const value = input.innerText.split("\n");
    const out = document.getElementById("homieoutput");
    const validationresult = document.getElementById("validationresult");

    var errors = [];
    var devices = {};
    var lineMap = {};
    toObjectTree(value, errors, devices, lineMap);

    var topicID = /^[a-z0-9]+[a-z0-9-]*$/i;

    // Validate device
    for (let [deviceid, device] of Object.entries(devices)) {
        if (!topicID.test(deviceid)) {
            errors.push({
                line: "n/a",
                text: "Device ''" + deviceid + "' id does not conform to topic id restriction!"
            });
        }

        checkAttributes("Device", deviceid, device, deviceMeta, errors, lineMap[deviceid]);

        // Validate nodes 
        for (let [nodeid, node] of Object.entries(device)) {
            if (nodeid.startsWith("$")) continue; // filter out all device attributes

            if (!topicID.test(nodeid)) {
                errors.push({
                    line: 0,
                    text: "Node '" + nodeid + "' id does not conform to topic id restriction!"
                });
            }

            checkAttributes("Node", nodeid, node, nodeMeta, errors, lineMap[deviceid][nodeid]);

            // Validate properties 
            for (let [propertyid, property] of Object.entries(node)) {
                if (propertyid.startsWith("$")) continue; // filter out all node attributes

                if (!topicID.test(propertyid)) {
                    errors.push({
                        line: 0,
                        text: "Property '" + propertyid + "' id does not conform to topic id restriction!"
                    });
                }

                checkAttributes("Property", propertyid, property, propertyMeta, errors, lineMap[deviceid][nodeid][propertyid]);

                if (property["$$value"]) {
                    const line = lineMap[deviceid][nodeid][propertyid].value;
                    const value = property["$$value"];
                    const format = property["$format"];
                    switch (property["$datatype"]) {
                        case "integer":
                            if (!value.match(/^[\d]+$/)) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' value of type integer contains invalid data: '" + value + "'!"
                                });
                            }
                            break;
                        case "float":
                            if (!value.match(/^[\d\.]+$/)) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' value of type float contains invalid data: '" + value + "'!"
                                });
                            }
                            break;
                        case "boolean":
                            if (!value.match(/^\b(true|false)\b$/)) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' value of type boolean contains invalid data: '" + value + "'!"
                                });
                            }
                            break;
                        case "enum":
                            if (!format) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' is of type enum but $format is not set!"
                                });
                                continue;
                            }
                            if (!value.match(new RegExp("^\\b(" + format.split(",").join("|") + ")\\b$", ""))) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' value of type enum contains invalid data: '" + value + "'. Must be one of '" + format + "'!"
                                });
                            }
                            break;
                        case "color":
                            if (!format || !format.match(/^\b(rgb|hsv)\b/)) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' is of type color but $format is not 'rgb' or 'hsv'!"
                                });
                                continue;
                            }
                            if (!value.match(/[\d]{3},[\d]{3},[\d]{3}/)) {
                                errors.push({
                                    line: line,
                                    text: "Property '" + propertyid + "' value of type color must be in the format xxx,xxx,xxx!"
                                });
                            }
                            break;
                        default:
                        case "string":
                            break;
                    }
                }
            }
        }
    }

    if (errors.length) {
        var v = "<table><thead><tr><th>Line</th><th>Error message</th></tr></thead><tbody>";
        errors.forEach(e => v += "<tr><td>" + (e.line+1) +"</td><td>"+e.text + "</td></tr>")
        out.innerHTML = v + "</tbody></table>";
        validationresult.innerHTML = "<b style='color:red'>Validation failed</b>";
        errors.filter(e => Number.isInteger(e.line)).forEach(e => value[e.line] = "<b style='color:red'>"+value[e.line]+"</b>");
        input.innerHTML = value.join("\n");
    } else {
        var v = "<div class='card'>Devices:<ul>";
        for (let [deviceid, device] of Object.entries(devices)) {
            if (!device["$name"]) continue;
            v += "<li>" + device["$name"] + " with Nodes:<ul>";
            for (let [nodeid, node] of Object.entries(device)) {
                if (!node["$name"]) continue;
                v += "<li>" + node["$name"] + " with Properties:<ul>";
                for (let [propertyid, property] of Object.entries(node)) {
                    if (!property["$name"]) continue;
                    v += "<li>" + property["$name"] + "</li>";
                }
                v += "</ul></li>";
            }
            v += "</ul></li>";
        }
        v += "</ul></div>";
        out.innerHTML = v;
        validationresult.innerHTML = "<b style='color:green'>Validation successful</b>";
    }
}