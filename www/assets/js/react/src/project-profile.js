
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
    Backbone.trigger('close:profile')
  },
  render: function() {
    var containerStyle = {
      width: '400px',
      height: '100%',
      zIndex: '1000',
      backgroundColor: 'inherit',
      color: 'inherit'
    }

    var closeStyle = {
      float: 'right',
      fontWeight: 'strong',
      marginRight: '40px',
      cursor: 'pointer'
    };

    var imgStyle = {
      width: '350px'
    }

    return (
      <div className='projectProfile clearfix' style={containerStyle}>
        <div style={closeStyle} onClick={this.close}>Close</div>
        <h2> {this.state.address} </h2>
        <h3> {this.state.status} </h3>
        <img style={imgStyle} src={this.state.picture} /><br />
        <p> {this.state.description} </p>
      </div>
    )
  }
})

