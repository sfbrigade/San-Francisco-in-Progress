/*

  UIKit-init

  Initialises iCheck and select2, since these can be universally applied
  to all checkboxes/select tags.

  Initialisation of dropzone is more complex and must be handled in the plugin itself.

 */

'use strict';

$(document).ready(function(){

  // iCheck (For nicer checkboxes)
  $('input').iCheck({
    checkboxClass: 'icheckbox_flat-green icheckbox',
    radioClass: 'iradio_flat-green iradio',
    increaseArea: '20%' // optional
  });

  // Select2 (For better select dropdowns with search, autocomplete etc.)
  $('select').select2();

});
