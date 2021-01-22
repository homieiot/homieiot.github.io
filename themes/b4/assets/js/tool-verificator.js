
const deviceMeta = {
    allowed: new Set(["$homie", "$name", "$state", "$nodes", "$extensions"]),
    deprecated: new Set(["$mac", "$localip", "$fw/name", "$fw/version", "$stats", "$implementation"]),
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
    ["$datatype", /^\b(integer|float|boolean|string|enum|color)\b$/],
]);

/**
 * Converts an input vector of topic parts ["homie", "device123", "node1", ...]
 * into an object tree {"device123":{"node1":...}}.
 *
 * This method acts recursive but is implemented stack based.
 *
 * @param {*} devices_out The object tree destination
 * @param {*} line_no_out Outputs the same object tree but with line numbers instead of values
 * @param {*} topic_vec Topic parts vector ["homie", "device123", "node1",...]
 * @param {*} value The value ("22")
 * @param {*} lineNumber The line number
 */
function topic_vec_to_object_tree(devices_out, line_no_out, topic_vec, value, line_no) {
    // Recursive stack
    var devices_out_stack = devices_out;
    var line_no_out_stack = line_no_out;
    
    for (var t = 1; t < topic_vec.length; t += 1) {
        if (topic_vec.length - 1 == t) {
            devices_out_stack[topic_vec[t]] = value;
            line_no_out_stack[topic_vec[t]] = line_no;
            continue;
        }
        var newChild = devices_out_stack[topic_vec[t]];
        if (!newChild) newChild = {};
        if (!(newChild instanceof Object)) {
            newChild = { "$$value": newChild };
        }
        devices_out_stack[topic_vec[t]] = newChild;
        devices_out_stack = newChild;

        newChild = line_no_out_stack[topic_vec[t]];
        if (!newChild) newChild = {};
        if (!(newChild instanceof Object)) {
            newChild = { "value": newChild };
        }
        line_no_out_stack[topic_vec[t]] = newChild;
        line_no_out_stack = newChild;
    }
}

/**
 * Converts an input string like "homie/device123/node1/propA 123" or "homie/device123" etc
 * into an object tree and merges it with the given `obj_out` object.
 * 
 * @param {*} input A string with zero or one whitespace as separator between a topic string and an optional value
 * @param {*} line The current line number. Used for error messages
 * @param {*} obj_out The destination object
 * @param {*} line_no_out Outputs the same object tree but with line numbers instead of values
 */
function topic_value_string_to_object(input, line, obj_out, line_no_out) {
    const i = input.indexOf(" ");
    if (i == -1) {
        if (input.length)
            return { line, text: "Not in the correct format. Syntax: topic_name topic_value" };
        else
            return null;
    }
    
    const topicname = input.substring(0, i);
    const topicvalue = input.substring(i + 1).trim();
    const topic_vec = topicname.split("/");

    if (!topic_vec.length || topic_vec[0] != "homie") {
        return { line, text: "Must begin with homie/" };
    }

    if (topic_vec.length > 2 && topic_vec.length < 6) {
        topic_vec_to_object_tree(obj_out, line_no_out, topic_vec, topicvalue, line);
    } else {
        return { line, text: "Does not describe a device!" };
    }
    
    return null;
}

/**
 * Check all attributes of an "object". The type ("Device","Node","Property") must be given
 * and the meta information (deviceMeta, nodeMeta or propertyMeta). "errors" is used as an output array.
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
    const input_vec = input.innerText.split("\n");
    const out = document.getElementById("homieoutput");
    const validationresult = document.getElementById("validationresult");

    var errors = [];
    var devices = {};
    var lineMap = {};
    
    for (var line = 0; line < input_vec.length; line += 1) {
        const r = topic_value_string_to_object(input_vec[line], line, devices, lineMap);
        if (r) errors.push(r);
    }
    
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
                            if (!value.match(/^[+-]?([0-9]*[.])?[0-9]+$/)) {
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
