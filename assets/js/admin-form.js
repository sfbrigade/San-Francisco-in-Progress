var url = window.location.href.split('/')

var projectId = url[url.length - 1]

if (projectId !== 'projects') {

	$.get('/projects/' + projectId, function(project) {

		$('#title').html('Updating ' + project.address)

		for (var key in project) {
			$('[name="' + key + '"]').val(project[key]).prop('checked', true)
		}

		$('form').attr('action', '/projects/' + projectId)
		$('.btn-danger').removeClass('invisible').click(function() {
			$.ajax({
				url: '/projects/' + projectId
				, type: 'DELETE'
				, success: function() {
					$('form').replaceWith('<h2> ' + project.address + ' deleted. </h2> <a href="/map"> Back to Home </a>')
				}
			})
		})
	})
}
