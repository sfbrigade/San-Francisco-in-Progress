$('#upload-button').on('click', function(argument){
	filepicker.setKey("AeM62uStiTHCOvwWEpFipz");
	filepicker.pick(
	  function(Blob){
			$('#property-image-url').val(Blob.url);
			$('.upload-btn').addClass('hidden');
			$('#property-image').attr('src', Blob.url);
			$('#property-image').removeClass('hidden');
	  }
	)
})
