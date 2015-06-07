
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
    var id = this.props.project._id || this.props.project.id
    return '/admin/projects/' + this.props.project._id
  }
  , close: function() {
    var projectProfile = this.getDOMNode()
    React.unmountComponentAtNode(projectProfile)
    $(projectProfile).remove()
    eventBus.trigger('close:profile')
  },
  render: function() {
    var closeStyle = {
      float: 'right',
      cursor: 'pointer',
      fontSize: '1.7em'
    };

    var imgStyle = {
      float: 'right',
      width: '50%'
    }

    var marginBottom = {
      marginBottom: '10px'
    }

    var editBtnStyle = {
      display: 'inline'
    }

    var addressStyle = {
      color: '#5bc0de'
      , display: 'inline'
    }

    var projectImage = this.props.project.picture 
      ? <img style={imgStyle} src={this.props.project.picture} /> 
      : null

    return (
      <div className='projectProfile'>
        <div className='glyphicon glyphicon-remove' style={closeStyle} onClick={this.close}></div><br />
        <div style={marginBottom}>
          <h3 style={addressStyle}> {this.props.project.address} </h3>
          <a href={this.createURL()} style={editBtnStyle}>(Edit)</a>
        </div>
        <div>{projectImage}</div>
        <h4> Sponsor Firm: </h4> 
        <p>{this.props.project.sponsorFirm} </p>
        <h4> Status: </h4>
        <p> {this.props.project.status} </p>
        <h4> Net new housing units: </h4>
        <p> {this.props.project.units} </p>
        <h4> Description: </h4> 
        <p> {this.props.project.description} </p>
      </div>
    )
  }
})

