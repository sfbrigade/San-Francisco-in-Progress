
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

    var marginBottom = {
      marginBottom: '10px'
    }

    var inline = {
      display: 'inline'
    }

    var projectImage = this.props.project.picture 
      ? <img style={imgStyle} src={this.props.project.picture} /> 
      : null

    return (
      <div className='projectProfile' style={containerStyle}>
        <div className='glyphicon glyphicon-remove' style={closeStyle} onClick={this.close}></div><br />
        <div style={marginBottom}>
          <h2 style={inline}> {this.props.project.address} </h2>
          <a href={this.createURL()} style={inline}>(Edit)</a>
        </div>
        <div>{projectImage}</div>
        <h4> Sponsor Firm: </h4> 
        <p>{this.props.project.sponsorFirm} </p>
        <h4> Status: </h4>
        <p> {this.props.project.status} </p>
        <h4> Net new housing: </h4>
        <p> {this.props.project.units} units </p>
        <h4> Description: </h4> 
        <p> {this.props.project.description} </p>
      </div>
    )
  }
})

