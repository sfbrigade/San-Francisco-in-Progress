
var React = require('react')
, Backbone = require('backbone');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      address: '500 Sansome St.'
      , zoning: 'Commercial'
      , status: 'Under Construction'
      , neighborhood: 'Financial District'
      , units: 100
      , picture: 'http://i.infopls.com/images/transamerican-tower.JPG'
      , description: 'Really awesome high-rise'
    }
  },
  close: function() {
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
      width: '350px'
    }

    return (
      <div className='projectProfile clearfix' style={containerStyle}>
        <div className='glyphicon glyphicon-remove' style={closeStyle} onClick={this.close}></div>
        <h2> {this.props.project.address} </h2>
        <h4> {this.props.project.status} </h4>
        <h4> {this.props.project.units} units </h4>
        <img style={imgStyle} src={this.props.project.picture} /><br />
        <p> {this.props.project.description} </p>
      </div>
    )
  }
})

