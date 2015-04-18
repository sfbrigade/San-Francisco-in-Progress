var url = window.location.href.split('/')

var projectId = url[url.length - 1]

if (projectId !== 'projects') {
	$.get('/projects/' + projectId, function(project) {
		$('#title').html('Updating Project')
		for (var key in project) {
			$('[name="' + key + '"]').val(project[key]).prop('checked', true)
		}
		$('form').attr('action', '/projects/' + projectId)
	})
	// TODO: add a delete button
}

