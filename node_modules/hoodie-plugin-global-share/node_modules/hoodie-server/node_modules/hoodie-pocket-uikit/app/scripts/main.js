/*
 *  Dropzone (drag n' drop file uploads with previews)
*/

Dropzone.options.dropzoneExample = { // The camelized version of the ID of the form element
  autoProcessQueue: false,
  uploadMultiple: true,
  parallelUploads: 100,
  maxFiles: 100,
  addRemoveLinks: true,
  url: "undefined",
  dictDefaultMessage: "Drop files here or click to upload",
  // The setting up of the dropzone
  init: function() {
    var myDropzone = this;

    // First change the button to actually tell Dropzone to process the queue.

    /*
    this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
      // Make sure that the form isn't actually being sent.
      e.preventDefault();
      e.stopPropagation();
      myDropzone.processQueue();
    });
    */

    // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
    // of the sending event because uploadMultiple is set to true.
    this.on("sendingmultiple", function() {
      // Gets triggered when the form is actually being sent.
      // Hide the success button or the complete form.
    });
    this.on("successmultiple", function(files, response) {
      // Gets triggered when the files have successfully been sent.
      // Redirect user or notify of success.
    });
    this.on("errormultiple", function(files, response) {
      // Gets triggered when there was an error sending the files.
      // Maybe show form again, and notify user of error
    });
  }

};

$(document).ready(function(){

  /*
   *  iCheck (nicer checkboxes)
  */
  $('input').iCheck({
    checkboxClass: 'icheckbox_flat-green icheckbox',
    radioClass: 'iradio_flat-green iradio',
    increaseArea: '20%' // optional
  });
  /*
   *  Select2 (Better select dropdowns with search, autocomplete etc.)
  */
  $("select").select2();
});
