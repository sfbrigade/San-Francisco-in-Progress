var React = require('react')
, Backbone = require('backbone')
, EmailForm = require('./email-subscribe-form.js')

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
  , showEmailForm: function () {
    var projectProfile = this.getDOMNode()
    React.unmountComponentAtNode(projectProfile)
    $(projectProfile).remove()
    var id = this.props.project._id || this.props.project.id;
    React.render(
      <EmailForm id={id} address={this.props.project.address} />
      , document.getElementById('projectProfile-container')
    )
  }
  , createURL: function() {
    var id = this.props.project._id || this.props.project.id
    return '/admin/projects/' + id
  }
  , hearingURL: function() {
    var id = this.props.project._id || this.props.project.id
    return '/hearings/new/' + id
  }
  , goToHearingForm: function() {
    window.location.href = this.hearingURL()
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

    var marginLeft = {
      marginLeft: '10px'
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
        <button className='btn-info' onClick={this.showEmailForm}>Subscribe for updates</button>
        <button className='btn-info' onClick={this.goToHearingForm} style={marginLeft}>Add a Hearing</button>
        <h4> Next Hearing: </h4>
        <span>Date: </span>
        <p> { (this.props.project.hearings && this.props.project.hearings.length) ?  this.props.project.hearings[0].date : ''} </p>
        <span>Location: </span>
        <p> { (this.props.project.hearings && this.props.project.hearings.length) ?  this.props.project.hearings[0].location : ''} </p>
        <span>Descrption: </span>
        <p> {(this.props.project.hearings && this.props.project.hearings.length) ?  this.props.project.hearings[0].description : ''} </p>
        <span>Preliminary Recommendations: </span>
        <p> { (this.props.project.hearings && this.props.project.hearings.length) ?  this.props.project.hearings[0].preliminaryRecommendation: ''} </p>
      </div>
    )
  }
})
