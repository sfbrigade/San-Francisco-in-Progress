
var React = require('react')
, Backbone = require('backbone');

eventBus = _.extend({}, Backbone.Events)

module.exports = React.createClass({
  getInitialState: function() {
    return {
      id: 1
      , address: '500 Sansome St.'
      , zoning: 'Commercial'
      , status: 'Under Construction'
      , neighborhood: 'Financial District'
      , units: 100
      , picture: 'http://i.infopls.com/images/transamerican-tower.JPG'
      , description: 'Really awesome high-rise'
    }
  }
  , createURL: function() {
    return '/admin/projects/' + this.props.project.id
  }
  , close: function() {
    var projectProfile = this.getDOMNode()
    React.unmountComponentAtNode(projectProfile)
    $(projectProfile).remove()
    eventBus.trigger('close:profile')
  },
  render: function() {
    var containerStyle = {
      width: '320px',
      height: '100%',
      backgroundColor: 'inherit',
      color: 'inherit'
    }

    var closeStyle = {
      float: 'right',
      cursor: 'pointer',
      fontSize: '2em'
    };

    var imgStyle = {
      width: '100%'
    }

    var projectImage = this.props.project.picture 
      ? <img style={imgStyle} src={this.props.project.picture} /> 
      : null

    return (
      <div className='projectProfile clearfix' style={containerStyle}>
        <div className='glyphicon glyphicon-remove' style={closeStyle} onClick={this.close}></div><br />
        <h2> {this.props.project.address} </h2>
        <a href={this.createURL()}>Edit</a>
        <div>{projectImage}</div>
        <h4> {this.props.project.status} </h4>
        <h4> {this.props.project.units} units </h4>
        <p> {this.props.project.description} </p>
      </div>
    )
  }
})

