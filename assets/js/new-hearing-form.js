var url = window.location.href.split('/')

var projectId = url[url.length - 1]

if (projectId !== 'projects') {

	$.get('/projects/' + projectId, function(project) {

		$('#title').html('Add a Hearing to ' + project.address)

		$('form').attr('action', '/hearings/' + projectId)

	})
}
