function create(devices, topicparts, value) {
    var parent = devices;
    for (var t=1;t<topicparts.length;t+=1) {
        if (topicparts.length-1==t) {
            parent[topicparts[t]] = value;
            continue;
        }
        var o = parent[topicparts[t]];
        if (!o) o = {};
        if (!(o instanceof Object)) {
            o = {"$$value": o};
        }
        parent[topicparts[t]] = o;
        parent = o;
    }
}

function toObjectTree(value, errors) {
    var devices = {};
    for (var line=0;line<value.length;line+=1) {
        const i = value[line].indexOf(" ");
        if (i==-1) {
            if (value[line].length)
                errors.push("Line "+line+" is not in the correct format. Syntax: topic_name topic_value");
            continue;
        }
        const topicname = value[line].substring(0,i);
        const topicvalue = value[line].substring(i+1).trim();
        const topicparts = topicname.split("/");

        if (!topicparts.length || topicparts[0] != "homie") {
            errors.push("Line "+line+" must begin with homie/");
            continue;
        }

        if (topicparts.length>2 && topicparts.length<6) {
            create(devices,topicparts,topicvalue);
        } else {
            errors.push("Line "+line+" does not describe a device!");
            continue;
        }
    }
    return devices;
}

const deviceMeta = {
    allowed: new Set(["$homie","$name","$state","$nodes","$stats","$implementation"]),
    deprecated: new Set(["$mac","$localip","$fw/name","$fw/version"]),
    required: new Set(["$homie","$name","$state","$nodes"])
}
const nodeMeta = {
    allowed: new Set(["$name","$type","$properties","$array"]),
    deprecated: new Set(),
    required: new Set(["$name","$properties"])
}
const propertyMeta = {
    allowed: new Set(["$name","$settable","$retained","$unit","$datatype","$format","$$value"]),
    deprecated: new Set([]),
    required: new Set(["$name"])
}

const valueRestrictions = new Map([
    [ "$name", new RegExp(/^.+$/i) ], // \p{L}\d[[:blank:]]
    [ "$homie", new RegExp("^[0-9\.]+$","") ],
    [ "$settable", new RegExp("^true|false$","") ],
    [ "$state", new RegExp("^init|ready|disconnected|sleeping|lost|alert$","") ],
    [ "$nodes", new RegExp("^[a-z0-9_\\-,]+$","i") ],
    [ "$properties", new RegExp("^[a-z0-9_\\-,]+$","i") ],
    [ "$stats", new RegExp("^$/","") ],
    [ "$datatype", new RegExp("^integer|float|boolean|string|enum|color$","") ],
]);


/**
 * Check all attributes of an "object". The type ("Device","Node","Property") must be given
 * and the meta information (deviceMeta, ...).
 */
function checkAttributes(type, objectid, object, meta, errors) {
    for (let [key, value] of Object.entries(object)) {
        if (key.startsWith("$")) {
            // Check for deprecated
            if (meta.deprecated.has(key)) {
                errors.push(type+" '"+objectid+"' has the deprecated attribute '"+key+"' set! Please check with the newest version of the convention.");
                continue;
            }
            // Check for allowed
            else if (!meta.allowed.has(key)) {
                errors.push(type+" '"+objectid+"' doesn't allow '"+key+"' to be set! Must be one of "+ Array.from(meta.allowed).join(', '));
                continue;
            }
            // Check value
            const restriction = valueRestrictions.get(key);
            console.log("restrict on",objectid,restriction)
            if (restriction && !value.match(restriction)) {
                errors.push("The value '"+value+"' of '"+objectid+"/"+key+"' does not conform to the convention!");
                continue;
            }
        }
    }

    const entries = new Set(Object.keys(object));
    for (let required of meta.required) {
        if (!entries.has(required)) {
            errors.push(type+" '"+objectid+"' requires '"+required+"' to be set!");
        }
    }
}

window.homieverificator = () => {
    const value = document.getElementById('homieinput').value.split("\n");
    const out = document.getElementById("homieoutput");

    var errors = [];
    var devices = toObjectTree(value, errors);

    var topicID = /^[a-z0-9]+$/i;

    // Validate device
    for (let [deviceid, device] of Object.entries(devices)) {
        if (!topicID.test(deviceid)) {
            errors.push("Device ''"+deviceid+"' id does not conform to topic id restriction!");
        }

        checkAttributes("Device", deviceid, device, deviceMeta, errors);

        // Validate nodes 
        for (let [nodeid, node] of Object.entries(device)) {
            if (nodeid.startsWith("$")) continue; // filter out all device attributes

            if (!topicID.test(nodeid)) {
                errors.push("Node '"+nodeid+"' id does not conform to topic id restriction!");
            }

            checkAttributes("Node", nodeid, node, nodeMeta, errors);

            // Validate properties 
            for (let [propertyid, property] of Object.entries(node)) {
                if (propertyid.startsWith("$")) continue; // filter out all node attributes

                if (!topicID.test(propertyid)) {
                    errors.push("Property '"+propertyid+"' id does not conform to topic id restriction!");
                }

                checkAttributes("Property", propertyid, property, propertyMeta, errors);
            }
        }
    }

    if (errors.length) {
        var v = "<b>Validation failed</b><br>Errors:<ul>";
        errors.forEach(e => v += "<li>"+ e + "</li>")
        out.innerHTML = v+"</ul>";
    } else {
        var v = "<b>Validation successful</b><br>Devices:<ul>";
        for (let [deviceid, device] of Object.entries(devices)) {
            if (!device["$name"]) continue;
            v += "<li>"+device["$name"]+" with Nodes:<ul>";
            for (let [nodeid, node] of Object.entries(device)) {
                if (!node["$name"]) continue;
                v += "<li>"+node["$name"]+" with Properties:<ul>";
                for (let [propertyid, property] of Object.entries(node)) {
                    if (!property["$name"]) continue;
                    v += "<li>"+property["$name"]+"</li>";
                }
                v += "</ul></li>";
            }
            v += "</ul></li>";
        }
        out.innerHTML = v;
    }
}