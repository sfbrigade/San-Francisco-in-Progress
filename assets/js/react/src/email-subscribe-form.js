var React = require('react')
, Backbone = require('backbone');

eventBus = _.extend({}, Backbone.Events)

module.exports = React.createClass({
	createActionURL: function () {
		return '/subscribe/' + this.props.id
	}
	, saveEmail: function (e) {
		this.setState({email: e.target.value})
	}
	, submitForm: function () {
		var url = this.createActionURL()
		$.post(url, {email: this.state.email})
		React.render(
			<SubmissionSuccess close={this.close} />
			, document.getElementById('projectProfile-container')
		)
	}
	, close: function() {
    var modal = this.getDOMNode()
    React.unmountComponentAtNode(modal)
    $(modal).remove()
    eventBus.trigger('close:profile')
  }
	, render: function render () {
		var marginTop = {
			marginTop: '15px'
		}

		var closeStyle = {
      float: 'right',
      cursor: 'pointer',
      fontSize: '1.7em'
    };

		return (
			<div className="form-group" >
				<div className='glyphicon glyphicon-remove' style={closeStyle} onClick={this.close}></div><br />
				<h1> Subscribe to {this.props.address} </h1>
				<p>You will receive email notifications when this project is on the agenda for a public hearing.</p>
		    <input onChange={this.saveEmail} type="text" name="email" className="form-control" placeholder="example@mail.com" />
				<button onClick={this.submitForm} style={marginTop} className="btn-info">Subscribe</button>
			</div>
		)
	}
})

var SubmissionSuccess = React.createClass({
	render: function () {
		var closeStyle = {
      float: 'right',
      cursor: 'pointer',
      fontSize: '1.7em'
    }

		return (
			<div className="form-group" >
				<div className='glyphicon glyphicon-remove' style={closeStyle} onClick={this.props.close}></div><br />
				<h3>Email subscribe successful</h3>
			</div>
		)
	}
})