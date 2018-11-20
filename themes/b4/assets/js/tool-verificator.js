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

        if (!device["$homie"] || !device["$name"] || !device["$state"] || !device["$nodes"]) {
            errors.push("Device '"+deviceid+"' requires '$homie', '$name', '$state' and '$nodes' to be set!");
        }

        // Validate nodes 
        for (let [nodeid, node] of Object.entries(device)) {
            if (nodeid.startsWith("$")) continue; // filter out all device attributes

            if (!topicID.test(nodeid)) {
                errors.push("Node '"+nodeid+"' id does not conform to topic id restriction!");
            }

            if (!node["$name"] || !node["$properties"]) {
                errors.push("Node '"+nodeid+"' requires '$name' and '$properties' to be set!");
            }

            // Validate properties 
            for (let [propertyid, property] of Object.entries(node)) {
                if (propertyid.startsWith("$")) continue; // filter out all node attributes

                if (!topicID.test(propertyid)) {
                    errors.push("Property '"+propertyid+"' id does not conform to topic id restriction!");
                }

                if (!property["$name"] || !property["$type"] || !property["$$value"]) {
                    errors.push("Property '"+propertyid+"' requires '$name' and '$type' to be set!");
                }
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