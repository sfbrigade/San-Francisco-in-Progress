var React = require('react')

module.exports.neighborhoods = React.createClass({
  getInitialState: function getInitialState () {
    return {
      neighborhoodName: true
    }
  }
  , applyFilter: function applyFilter (e) {
    console.log('heres an event. look for attr and prop: ', JSON.stringify(e))
    var neighorhood = $(e.currentTarget).attr('name');
    var show = $(e.currentTarget).prop('checked');
    this.setState({[neighorhood]: show});
  }
	, componentDidMount: function () {
    // fetch neighborhood list
		var neighborhoods = require('../../../../data/neighborhoods.json')
    this.setProps({neighborhoods: neighborhoods})

    // so we can keep track of which ones are selected
    _.each(neighborhoods, function(neighborhood) {
      this.setState({[neighborhood]: true})
    })

    // Using JQuery UI accordion plugin to make filters collapsible 
    $("#collapse").accordion({
      collapsible: true,
      active: false,
      heightStyle: 'content'
    });

    $("#sidebar input").prop("checked", true);
    $("#legend input").prop("checked", true);
  }
  , selectAll: function selectAll() {
    this.setState(function (state, props) {
      var newState = {}
      _.each(this.state, function (hood) {
        newState[hood] = true
      })
      return newState
    })
  }
  , clearAll: function clearAll() {
    this.setState(function (state, props) {
      var newState = {}
      _.each(this.state, function (hood) {
        newState[hood] = true
      })
      return newState
    })
  }
	, render: function() {
    return (
      <div id="collapse"> 
        <a href="#" id="select-all" onClick={this.selectAlll}>Select All</a> | 
        <a href="#" id="clear-all" onClick={this.clearAll}>Clear All</a>
       	<ul className="neighborhood-list">
	      	{_.map(this.props.neighborhoods, function(hood) {
	      		return (
	      			<li>
                <input type="checkbox" name={hood.name} onClick={this.applyFilter} /> 
                {hood.label}
              </li>
	      		)
	      	})}
  			</ul>
      </div> 
    )
	}
})

module.exports.projectStatus = React.createClass({
  getInitialState: function getInitialState() {
    return {
      construction: true
      , planning: true
      , building: true
    }
  }
  , applyFilter: function applyFilter(e) {
    console.log('heres an event. look for attr and prop: ', JSON.stringify(e))
    var status = $(e.currentTarget).attr('name');
    var show = $(e.currentTarget).prop('checked');
    this.setState({[status]: show}) 
  }
	, render: function () {
		return (
			<div>
        <div className="filter-status">
          <input type="checkbox" name="planning" onClick={this.applyFilter}/>
          <div className="key blue"></div>
          Planning Permit phase <br />
        </div>
        <div className="filter-status">
          <input type="checkbox" name="building" onClick={this.applyFilter} /> 
          <div className="key red"></div> 
          Building Permit phase <br />
        </div>
        <div className="filter-status">
          <input type="checkbox" name="construction" onClick={this.applyFilter} />
          <div className="key green"></div> 
          Under Construction <br />
        </div>
      </div>
    )
  }
})

module.exports.developmentType = React.createClass({
  applyFilter: function applyFilter(e) {
    var type = $(e.currentTarget).attr('name');
    var show = $(e.currentTarget).prop('checked');
    this.state.set({[type]: show}) 
  }
  , render: function () {
    return (
      <div> 
        <div className="filter-type">
          <input type="checkbox" name="Residential" onClick={this.applyFilter} />  
          <img src="img/residential.svg" />  Residential
        </div>
        <div className="filter-type">
          <input type="checkbox" name="Mixed Use" onClick={this.applyFilter} /> 
          <img src="img/mixeduse.svg" />  Mixed Use 
        </div>
      </div>
    )
  }
})

module.exports.numUnits = React.createClass({
  getInitialState: function getInitialState () {
    return {
      units: 0
    }
  }
  , applyFilter: function applyFilter (e) {
    this.setState({units: e.target.value})
  }
	, render: function() {
		return (
			<div>
      	<div id="min_units_display">{this.state.units}</div>
      	<input type="range" 
          min="1" 
          max="500" 
          defaultValue="0" 
          id="min_units" 
          onChange={this.applyFilter} 
        />
    	</div>
		)
	}
})