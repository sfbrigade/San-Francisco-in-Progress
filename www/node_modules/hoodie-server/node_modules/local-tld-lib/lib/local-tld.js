// An app’s API to ~/.local-tld.json
var fs = require("fs");

module.exports.tld_file = process.env.HOME + "/.local-tld.json";
module.exports.base_port = 6000;

module.exports.add = function setPort(name, port) {
  var map = read_json(module.exports.tld_file);

  var entry = map[port];
  if (entry && entry.name !== name) {
    console.log(entry);
    console.log(name);
    throw new Error('This port is already defined within ltld.');
  } else if (entry && entry.name === name) {
    return;
  }

  map[port] = {name: name};
  write_json(module.exports.tld_file, map);
};

module.exports.remove = function removePort(name) {
  var map = read_json(module.exports.tld_file);
  var port = module.exports.getPort(name);
  delete map[port];
  write_json(module.exports.tld_file, map);
};

module.exports.getPort = function getPort(name) {

  var map = read_json(module.exports.tld_file);
  var max_port = module.exports.base_port;

  for(var port_m in map) {
    port_m = parseInt(port_m, 10);

    if(port_m > max_port) {
      max_port = port_m;
    }

    var name_m = map[port_m].name;
    if(name_m == name) {
      return port_m;
    }
  }

  // if we got here, max_port is the highest registered port
  var new_port = max_port + 1;
  map[new_port] = {
    name: name
  };

  write_json(module.exports.tld_file, map);
  return new_port;
};

module.exports.setAlias = function setAlias(name, alias) {
  var map = read_json(module.exports.tld_file);
  for(var port_m in map) {
    var name_m = map[port_m].name;
    if(name_m == name) {
      // found it
      if(!map[port_m].aliases) {
        map[port_m].aliases = {};
      }
      map[port_m].aliases[alias] = true;
      write_json(module.exports.tld_file, map);
      return true;
    }
  }
  return false;
};

var read_json = function read_json(filename, default_value) {
  try {
    return JSON.parse(fs.readFileSync(filename));
  } catch(e) {
    return default_value || {};
  }
};

var write_json = function write_json(filename, value) {
  fs.writeFileSync(filename + ".tmp", JSON.stringify(value));
  fs.renameSync(filename + ".tmp", filename);
};
