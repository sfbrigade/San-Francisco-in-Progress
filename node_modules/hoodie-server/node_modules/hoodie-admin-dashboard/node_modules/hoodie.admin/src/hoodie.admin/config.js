// HoodieAdmin App Config
// ======================

function hoodieConfig(hoodieAdmin) {
  var config = {};

  config.fetch = function () {
    window.alert('tbd');
  };

  config.update = function () {
    window.alert('tbd');
  };

  hoodieAdmin.config = config;
}

module.exports = hoodieConfig;
